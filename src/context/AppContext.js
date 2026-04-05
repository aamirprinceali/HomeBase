import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const AppContext = createContext({});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [household, setHousehold] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [householdTasks, setHouseholdTasks] = useState([]);
  const [shoppingItems, setShoppingItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const householdId = userProfile?.householdId;

  // Subscribe to household data
  useEffect(() => {
    if (!householdId) {
      setLoadingData(false);
      return;
    }

    const unsubHousehold = onSnapshot(doc(db, 'households', householdId), (snap) => {
      if (snap.exists()) setHousehold({ id: snap.id, ...snap.data() });
    });

    const unsubTasks = onSnapshot(
      query(
        collection(db, 'households', householdId, 'tasks'),
        orderBy('createdAt', 'desc')
      ),
      (snap) => {
        setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    const unsubHouseholdTasks = onSnapshot(
      query(
        collection(db, 'households', householdId, 'householdTasks'),
        orderBy('createdAt', 'desc')
      ),
      (snap) => {
        setHouseholdTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    const unsubShopping = onSnapshot(
      query(
        collection(db, 'households', householdId, 'shoppingItems'),
        orderBy('createdAt', 'desc')
      ),
      (snap) => {
        setShoppingItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    // Subscribe to expenses for this household (each user sees their own via UI filter)
    const unsubExpenses = onSnapshot(
      query(
        collection(db, 'households', householdId, 'expenses'),
        orderBy('createdAt', 'desc')
      ),
      (snap) => {
        setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    );

    setLoadingData(false);

    return () => {
      unsubHousehold();
      unsubTasks();
      unsubHouseholdTasks();
      unsubShopping();
      unsubExpenses();
    };
  }, [householdId]);

  // Load members whenever household changes
  useEffect(() => {
    if (!household?.members?.length) return;

    const loadMembers = async () => {
      const memberProfiles = await Promise.all(
        household.members.map(async (uid) => {
          const snap = await getDoc(doc(db, 'users', uid));
          return snap.exists() ? { id: snap.id, ...snap.data() } : null;
        })
      );
      setMembers(memberProfiles.filter(Boolean));
    };

    loadMembers();
  }, [household]);

  // --- Household ---
  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const createHousehold = async (name) => {
    const inviteCode = generateInviteCode();
    const ref = doc(collection(db, 'households'));
    await setDoc(ref, {
      name,
      inviteCode,
      createdBy: user.uid,
      members: [user.uid],
      admins: [user.uid],
      createdAt: serverTimestamp(),
    });
    await updateUserProfile({ householdId: ref.id, role: 'admin' });
    return ref.id;
  };

  const joinHousehold = async (inviteCode) => {
    const q = query(collection(db, 'households'), where('inviteCode', '==', inviteCode.toUpperCase()));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error('Invalid invite code. Please check and try again.');

    const householdDoc = snap.docs[0];
    const hId = householdDoc.id;
    const currentMembers = householdDoc.data().members || [];

    if (currentMembers.includes(user.uid)) {
      throw new Error('You are already in this household.');
    }

    await updateDoc(doc(db, 'households', hId), {
      members: [...currentMembers, user.uid],
    });
    await updateUserProfile({ householdId: hId, role: 'member' });
    return hId;
  };

  const regenerateInviteCode = async () => {
    if (!householdId) return;
    const newCode = generateInviteCode();
    await updateDoc(doc(db, 'households', householdId), { inviteCode: newCode });
  };

  // --- Tasks ---
  const addTask = async (taskData) => {
    await addDoc(collection(db, 'households', householdId, 'tasks'), {
      ...taskData,
      createdBy: user.uid,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  };

  const completeTask = async (taskId, assignedBy) => {
    await updateDoc(doc(db, 'households', householdId, 'tasks', taskId), {
      status: 'completed',
      completedAt: serverTimestamp(),
      completedBy: user.uid,
    });
  };

  const uncompleteTask = async (taskId) => {
    await updateDoc(doc(db, 'households', householdId, 'tasks', taskId), {
      status: 'pending',
      completedAt: null,
      completedBy: null,
    });
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, 'households', householdId, 'tasks', taskId));
  };

  const updateTask = async (taskId, updates) => {
    await updateDoc(doc(db, 'households', householdId, 'tasks', taskId), updates);
  };

  // --- Household Board Tasks ---
  const addHouseholdTask = async (taskData) => {
    await addDoc(collection(db, 'households', householdId, 'householdTasks'), {
      ...taskData,
      postedBy: user.uid,
      claimedBy: null,
      plannedDate: null,
      status: 'new',
      createdAt: serverTimestamp(),
    });
  };

  const claimHouseholdTask = async (taskId) => {
    await updateDoc(doc(db, 'households', householdId, 'householdTasks', taskId), {
      claimedBy: user.uid,
      status: 'claimed',
    });
  };

  const unclaimHouseholdTask = async (taskId) => {
    await updateDoc(doc(db, 'households', householdId, 'householdTasks', taskId), {
      claimedBy: null,
      status: 'new',
    });
  };

  const setHouseholdTaskDate = async (taskId, date) => {
    await updateDoc(doc(db, 'households', householdId, 'householdTasks', taskId), {
      plannedDate: date,
    });
  };

  const completeHouseholdTask = async (taskId) => {
    await updateDoc(doc(db, 'households', householdId, 'householdTasks', taskId), {
      status: 'done',
      completedAt: serverTimestamp(),
      completedBy: user.uid,
    });
  };

  const deleteHouseholdTask = async (taskId) => {
    await deleteDoc(doc(db, 'households', householdId, 'householdTasks', taskId));
  };

  // --- Shopping List ---
  const addShoppingItem = async (name) => {
    await addDoc(collection(db, 'households', householdId, 'shoppingItems'), {
      name,
      addedBy: user.uid,
      checkedBy: null,
      isChecked: false,
      createdAt: serverTimestamp(),
    });
  };

  const toggleShoppingItem = async (itemId, currentChecked) => {
    await updateDoc(doc(db, 'households', householdId, 'shoppingItems', itemId), {
      isChecked: !currentChecked,
      checkedBy: !currentChecked ? user.uid : null,
    });
  };

  const deleteShoppingItem = async (itemId) => {
    await deleteDoc(doc(db, 'households', householdId, 'shoppingItems', itemId));
  };

  const clearCheckedItems = async () => {
    const checked = shoppingItems.filter((i) => i.isChecked);
    await Promise.all(
      checked.map((i) => deleteDoc(doc(db, 'households', householdId, 'shoppingItems', i.id)))
    );
  };

  // --- Expenses ---
  const addExpense = async ({ amount, category, note, date }) => {
    await addDoc(collection(db, 'households', householdId, 'expenses'), {
      amount,
      category,
      note: note || '',
      date,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
    });
  };

  const deleteExpense = async (expenseId) => {
    await deleteDoc(doc(db, 'households', householdId, 'expenses', expenseId));
  };

  // --- Member management ---
  const updateMemberRole = async (memberId, role) => {
    await setDoc(doc(db, 'users', memberId), { role }, { merge: true });
    if (role === 'admin') {
      await updateDoc(doc(db, 'households', householdId), {
        admins: [...(household.admins || []), memberId],
      });
    } else {
      await updateDoc(doc(db, 'households', householdId), {
        admins: (household.admins || []).filter((id) => id !== memberId),
      });
    }
  };

  // Helpers
  const getMyTasks = () => {
    if (!user) return [];
    return tasks.filter(
      (t) => (t.assignedTo === user.uid || t.createdBy === user.uid) && !t.assignedTo || t.assignedTo === user.uid || (t.createdBy === user.uid && !t.assignedTo)
    );
  };

  const getTasksForMember = (uid) => tasks.filter((t) => t.assignedTo === uid || (t.createdBy === uid && !t.assignedTo));

  const getMemberById = (uid) => members.find((m) => m.id === uid);

  return (
    <AppContext.Provider
      value={{
        household,
        members,
        tasks,
        householdTasks,
        shoppingItems,
        expenses,
        loadingData,
        // Household
        createHousehold,
        joinHousehold,
        regenerateInviteCode,
        // Tasks
        addTask,
        completeTask,
        uncompleteTask,
        deleteTask,
        updateTask,
        getMyTasks,
        getTasksForMember,
        // Household board
        addHouseholdTask,
        claimHouseholdTask,
        unclaimHouseholdTask,
        setHouseholdTaskDate,
        completeHouseholdTask,
        deleteHouseholdTask,
        // Shopping
        addShoppingItem,
        toggleShoppingItem,
        deleteShoppingItem,
        clearCheckedItems,
        // Expenses
        addExpense,
        deleteExpense,
        // Members
        getMemberById,
        updateMemberRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
