/* ==========================================================================
   AURA – Smart Student Lifestyle & Productivity Dashboard
   Master Application Script (Vanilla JavaScript ES6+)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. MOTIVATIONAL QUOTES & CONSTANTS
  // ==========================================================================
  const MOTIVATIONAL_QUOTES = [
    "Small progress is still progress.",
    "Your future is created by what you do today.",
    "Focus on progress, not perfection.",
    "Don't wish for it, work for it.",
    "Consistency is the key to mastering any skill.",
    "Success isn't about greatness, it's about consistency.",
    "The secret of getting ahead is getting started.",
    "Action is the foundational key to all success."
  ];

  const TIMER_MODES = {
    focus: { label: "DEEP FOCUS SPRINT", minutes: 25 },
    shortBreak: { label: "SHORT REFRESH BREAK", minutes: 5 },
    longBreak: { label: "LONG REST BREAK", minutes: 15 }
  };

  // ==========================================================================
  // 2. STATE MANAGEMENT & STORAGE HELPER
  // ==========================================================================
  const STORAGE_KEY = 'AURA_STUDENT_APP_DATA_V1';

  let AppState = {
    profile: {
      name: "Alex Rivers",
      college: "National Institute of Technology",
      course: "B.Tech Computer Science & AI"
    },
    settings: {
      theme: "dark",
      currency: "₹",
      notificationsEnabled: true
    },
    tasks: [],
    habits: [],
    expenses: [],
    timer: {
      mode: "focus",
      secondsLeft: 25 * 60,
      totalDuration: 25 * 60,
      isRunning: false,
      completedToday: 4,
      totalMinutesToday: 100
    }
  };

  let timerInterval = null;

  // Initialize Data from LocalStorage or Seed Defaults
  function initStorage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        AppState = { ...AppState, ...parsed };
      } catch (e) {
        console.error("Failed to parse LocalStorage data, loading defaults.", e);
        seedDefaultData();
      }
    } else {
      seedDefaultData();
    }
    saveState();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
  }

  function seedDefaultData() {
    const todayStr = getFormattedDateStr(new Date());
    const yesterdayStr = getFormattedDateStr(getOffsetDate(-1));
    const twoDaysAgoStr = getFormattedDateStr(getOffsetDate(-2));

    AppState.profile = {
      name: "Alex Rivers",
      college: "National Institute of Technology",
      course: "B.Tech Computer Science & AI"
    };

    AppState.settings = {
      theme: "dark",
      currency: "₹",
      notificationsEnabled: true
    };

    AppState.tasks = [
      { id: 't1', title: 'Implement AVL Tree Rotations & Balancing', subject: 'Data Structures', priority: 'HIGH', dueDate: todayStr, estHours: 2.0, completed: false },
      { id: 't2', title: 'Java Multithreading & Executors Assignment', subject: 'Java', priority: 'HIGH', dueDate: todayStr, estHours: 1.5, completed: false },
      { id: 't3', title: 'Design Responsive Dashboard UI in CSS', subject: 'Web Development', priority: 'MEDIUM', dueDate: todayStr, estHours: 2.5, completed: true },
      { id: 't4', title: 'SQL Query Optimization & Indexing Quiz', subject: 'DBMS', priority: 'MEDIUM', dueDate: todayStr, estHours: 1.0, completed: true },
      { id: 't5', title: 'Calculus Double Integrals Worksheet', subject: 'Mathematics', priority: 'LOW', dueDate: yesterdayStr, estHours: 1.0, completed: true },
      { id: 't6', title: 'Prepare Presentation for Web Dev Mini Project', subject: 'Web Development', priority: 'HIGH', dueDate: todayStr, estHours: 1.5, completed: true },
      { id: 't7', title: 'Submit DBMS Lab Report 4', subject: 'DBMS', priority: 'HIGH', dueDate: todayStr, estHours: 1.0, completed: true }
    ];

    // Seed 7 days of completed habit dates for high streak
    const past7Days = Array.from({ length: 7 }, (_, i) => getFormattedDateStr(getOffsetDate(-i)));

    AppState.habits = [
      { id: 'h1', title: 'Drink 2L Water', icon: '💧', completedDates: [...past7Days] },
      { id: 'h2', title: 'Study 2+ Hours', icon: '📚', completedDates: [...past7Days] },
      { id: 'h3', title: '20m Exercise', icon: '🏃', completedDates: [...past7Days.slice(0, 5)] },
      { id: 'h4', title: 'Read 15 Pages', icon: '📖', completedDates: [...past7Days] },
      { id: 'h5', title: 'Sleep on Time', icon: '😴', completedDates: [yesterdayStr, twoDaysAgoStr] }
    ];

    AppState.expenses = [
      { id: 'e1', description: 'Canteen Lunch & Coffee', amount: 150, category: 'Food', date: todayStr },
      { id: 'e2', description: 'Bus Pass Monthly Renewal', amount: 200, category: 'Transport', date: todayStr },
      { id: 'e3', description: 'Web Dev Reference PDF Book', amount: 500, category: 'Education', date: twoDaysAgoStr },
      { id: 'e4', description: 'Evening Snacks with Study Group', amount: 70, category: 'Food', date: yesterdayStr }
    ];

    AppState.timer = {
      mode: 'focus',
      secondsLeft: 25 * 60,
      totalDuration: 25 * 60,
      isRunning: false,
      completedToday: 4,
      totalMinutesToday: 100
    };
  }

  // Helper Date utilities
  function getFormattedDateStr(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getOffsetDate(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d;
  }

  // ==========================================================================
  // 3. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(message, icon = '✅') {
    if (!AppState.settings.notificationsEnabled) return;

    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[m]);
  }

  // ==========================================================================
  // 4. THEME TOGGLER
  // ==========================================================================
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    AppState.settings.theme = theme;
    saveState();
  }

  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    const newTheme = AppState.settings.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    showToast(newTheme === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', newTheme === 'dark' ? '🌙' : '☀️');
  });

  document.getElementById('setLightModeBtn')?.addEventListener('click', () => {
    applyTheme('light');
    showToast('☀️ Light mode enabled', '☀️');
  });

  document.getElementById('setDarkModeBtn')?.addEventListener('click', () => {
    applyTheme('dark');
    showToast('🌙 Dark mode enabled', '🌙');
  });

  // ==========================================================================
  // 5. LIVE CLOCK & GREETING
  // ==========================================================================
  function updateLiveClock() {
    const now = new Date();
    const clockEl = document.getElementById('headerClock');
    const dateEl = document.getElementById('headerDatePill');
    const dashDayBadge = document.getElementById('dashDayBadge');
    const greetingEl = document.getElementById('dashGreeting');

    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    const options = { month: 'short', day: 'numeric' };
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', options);

    if (dashDayBadge) {
      const fullOptions = { weekday: 'long', month: 'long', day: 'numeric' };
      dashDayBadge.textContent = now.toLocaleDateString('en-US', fullOptions).toUpperCase();
    }

    if (greetingEl) {
      const hour = now.getHours();
      let partOfDay = 'Morning';
      if (hour >= 12 && hour < 17) partOfDay = 'Afternoon';
      else if (hour >= 17) partOfDay = 'Evening';
      greetingEl.textContent = `Good ${partOfDay}, ${AppState.profile.name} 👋`;
    }
  }

  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // Quote Rotator
  function refreshQuote() {
    const quoteEl = document.getElementById('motivationalQuote');
    if (quoteEl) {
      const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
      quoteEl.textContent = randomQuote;
    }
  }

  document.getElementById('refreshQuoteBtn')?.addEventListener('click', () => {
    refreshQuote();
    showToast('Quote refreshed ✨', '💡');
  });

  // ==========================================================================
  // 6. ROUTING & VIEW SWITCHER
  // ==========================================================================
  const views = {
    dashboard: { title: "Dashboard", subtitle: "Plan. Focus. Track. Grow." },
    planner: { title: "Study Planner", subtitle: "Organize tasks & manage academic deadlines" },
    timer: { title: "Focus Timer", subtitle: "Pomodoro timer for deep study sprints" },
    habits: { title: "Habit Tracker", subtitle: "Build daily consistency & monitor your streaks" },
    expenses: { title: "Expense Tracker", subtitle: "Manage your daily student budget & expenditures" },
    analytics: { title: "Analytics", subtitle: "Visual insights into your study habits & progress" },
    settings: { title: "Settings", subtitle: "Customize profile, theme & preferences" }
  };

  function switchView(viewId) {
    if (!views[viewId]) return;

    // Toggle active class on view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById(`view-${viewId}`);
    if (targetSec) targetSec.classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewId);
    });

    // Update Header Title
    document.getElementById('currentPageTitle').textContent = views[viewId].title;
    document.getElementById('currentPageSubtitle').textContent = views[viewId].subtitle;

    // Trigger render routines for the active view
    renderViewContent(viewId);

    // Close mobile menu if open
    closeSidebarMobile();
  }

  document.querySelectorAll('[data-view]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = trigger.dataset.view;
      switchView(viewId);
      window.location.hash = viewId;
    });
  });

  function renderViewContent(viewId) {
    updateBadgeCounts();
    if (viewId === 'dashboard') renderDashboard();
    if (viewId === 'planner') renderPlanner();
    if (viewId === 'timer') renderTimerView();
    if (viewId === 'habits') renderHabits();
    if (viewId === 'expenses') renderExpenses();
    if (viewId === 'analytics') renderAnalytics();
    if (viewId === 'settings') renderSettings();
  }

  function updateBadgeCounts() {
    const pendingTasks = AppState.tasks.filter(t => !t.completed).length;
    const badgeEl = document.getElementById('pendingTaskBadge');
    if (badgeEl) {
      badgeEl.textContent = pendingTasks;
      badgeEl.style.display = pendingTasks > 0 ? 'inline-block' : 'none';
    }
  }

  // Sidebar Mobile Toggle Controls
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
  });

  document.getElementById('closeSidebarBtn')?.addEventListener('click', closeSidebarMobile);
  sidebarOverlay?.addEventListener('click', closeSidebarMobile);

  function closeSidebarMobile() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
  }

  // ==========================================================================
  // 7. DASHBOARD RENDER ENGINE
  // ==========================================================================
  function renderDashboard() {
    const todayStr = getFormattedDateStr(new Date());

    // 1. Task Stat Calculation
    const todayTasks = AppState.tasks.filter(t => t.dueDate === todayStr || !t.completed);
    const completedTodayTasks = todayTasks.filter(t => t.completed).length;
    const totalTodayTasks = todayTasks.length;

    const dashStatTasks = document.getElementById('dashStatTasks');
    const dashTaskBar = document.getElementById('dashTaskBar');
    if (dashStatTasks) dashStatTasks.textContent = `${completedTodayTasks} / ${totalTodayTasks}`;
    if (dashTaskBar) {
      const taskPct = totalTodayTasks > 0 ? (completedTodayTasks / totalTodayTasks) * 100 : 100;
      dashTaskBar.style.width = `${taskPct}%`;
    }

    // 2. Study Time Stat
    const studyHours = (AppState.timer.totalMinutesToday / 60).toFixed(1);
    const dashStatStudy = document.getElementById('dashStatStudy');
    const dashStudyBar = document.getElementById('dashStudyBar');
    if (dashStatStudy) dashStatStudy.textContent = `${studyHours} hrs`;
    if (dashStudyBar) {
      const studyPct = Math.min(100, (AppState.timer.totalMinutesToday / 180) * 100);
      dashStudyBar.style.width = `${studyPct}%`;
    }

    // 3. Streak Stat
    const maxStreak = calculateBestStreak();
    const dashStatStreak = document.getElementById('dashStatStreak');
    if (dashStatStreak) dashStatStreak.textContent = `${maxStreak} Days`;

    // 4. Expenses Stat
    const weeklyTotal = calculateWeeklyExpenses();
    const dashStatExpense = document.getElementById('dashStatExpense');
    if (dashStatExpense) dashStatExpense.textContent = `${AppState.settings.currency}${weeklyTotal}`;

    // 5. Circular Productivity Progress Index
    const habitCount = AppState.habits.length;
    const completedHabitsCount = AppState.habits.filter(h => h.completedDates.includes(todayStr)).length;

    const taskPct = totalTodayTasks > 0 ? (completedTodayTasks / totalTodayTasks) : 1;
    const habitPct = habitCount > 0 ? (completedHabitsCount / habitCount) : 1;
    const studyPct = Math.min(1, AppState.timer.totalMinutesToday / 180);

    const overallPct = Math.round((taskPct * 0.4 + habitPct * 0.4 + studyPct * 0.2) * 100);

    const percentText = document.getElementById('dashProgressPercent');
    const progressCircle = document.getElementById('dashProgressCircle');

    if (percentText) percentText.textContent = `${overallPct}%`;
    if (progressCircle) {
      const radius = 76;
      const circumference = 2 * Math.PI * radius; // ~477.5
      const offset = circumference - (overallPct / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    }

    // Breakdown numbers
    document.getElementById('dashBreakdownTasks').textContent = `${completedTodayTasks} / ${totalTodayTasks}`;
    document.getElementById('dashBreakdownHabits').textContent = `${completedHabitsCount} / ${habitCount}`;
    document.getElementById('dashBreakdownStudy').textContent = `${studyHours} / 3.0 hrs`;

    // Priority Mini Tasks Preview
    renderMiniTaskList();
  }

  function renderMiniTaskList() {
    const container = document.getElementById('dashMiniTaskList');
    if (!container) return;

    const pendingPriorityTasks = AppState.tasks.filter(t => !t.completed).slice(0, 3);

    if (pendingPriorityTasks.length === 0) {
      container.innerHTML = `
        <div class="p-3 text-center text-secondary font-medium">
          🎉 All priority tasks completed for today!
        </div>
      `;
      return;
    }

    container.innerHTML = pendingPriorityTasks.map(task => `
      <div class="mini-task-item">
        <div class="mini-task-left">
          <span class="custom-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTaskCompletion('${task.id}')">
            ${task.completed ? '✓' : ''}
          </span>
          <span class="font-medium">${escapeHtml(task.title)}</span>
        </div>
        <span class="subject-badge">${escapeHtml(task.subject)}</span>
      </div>
    `).join('');
  }

  function calculateBestStreak() {
    if (AppState.habits.length === 0) return 0;
    let max = 0;
    AppState.habits.forEach(h => {
      let streak = 0;
      let checkDate = new Date();
      while (true) {
        const dateStr = getFormattedDateStr(checkDate);
        if (h.completedDates.includes(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      if (streak > max) max = streak;
    });
    return max;
  }

  function calculateWeeklyExpenses() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    return AppState.expenses.reduce((sum, exp) => {
      const expDate = new Date(exp.date);
      if (expDate >= startOfWeek) {
        return sum + Number(exp.amount);
      }
      return sum;
    }, 0);
  }

  // ==========================================================================
  // 8. STUDY PLANNER ENGINE
  // ==========================================================================
  function renderPlanner() {
    const container = document.getElementById('taskListContainer');
    if (!container) return;

    const search = document.getElementById('taskSearchInput')?.value.toLowerCase() || '';
    const subjectFilter = document.getElementById('taskSubjectFilter')?.value || 'ALL';
    const priorityFilter = document.getElementById('taskPriorityFilter')?.value || 'ALL';
    const statusFilter = document.getElementById('taskStatusFilter')?.value || 'ALL';

    const filtered = AppState.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search) || task.subject.toLowerCase().includes(search);
      const matchesSubject = subjectFilter === 'ALL' || task.subject === subjectFilter;
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
      const matchesStatus = statusFilter === 'ALL' || (statusFilter === 'COMPLETED' ? task.completed : !task.completed);
      return matchesSearch && matchesSubject && matchesPriority && matchesStatus;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✨</div>
          <h3 class="empty-title">Your day is clear</h3>
          <p class="empty-sub">Add a task and start making progress on your academic goals.</p>
          <button class="btn btn-primary btn-sm mt-3" onclick="document.getElementById('openAddTaskModalBtn').click()">+ Add Task</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(task => {
      const priorityClass = task.priority === 'HIGH' ? 'badge-danger' : task.priority === 'MEDIUM' ? 'badge-warning' : 'badge-success';
      const priorityEmoji = task.priority === 'HIGH' ? '🔴' : task.priority === 'MEDIUM' ? '🟡' : '🟢';

      return `
        <div class="glass-card task-card ${task.completed ? 'completed' : ''}">
          <div class="task-card-header">
            <div class="task-check-title">
              <div class="custom-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTaskCompletion('${task.id}')">
                ${task.completed ? '✓' : ''}
              </div>
              <span class="task-title">${escapeHtml(task.title)}</span>
            </div>
          </div>

          <div class="task-meta-pills">
            <span class="subject-badge">${escapeHtml(task.subject)}</span>
            <span class="badge ${priorityClass}">${priorityEmoji} ${task.priority}</span>
          </div>

          <div class="task-card-footer">
            <span>📅 Due: ${task.dueDate || 'Today'} (${task.estHours || 1}h)</span>
            <button class="task-delete-btn" onclick="deleteTask('${task.id}')" title="Delete Task">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Global Task Toggle Callback
  window.toggleTaskCompletion = function(taskId) {
    const task = AppState.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      saveState();
      renderPlanner();
      renderDashboard();
      updateBadgeCounts();
      showToast(task.completed ? '🎉 Task completed!' : 'Task set to pending', task.completed ? '🎉' : 'ℹ️');
    }
  };

  window.deleteTask = function(taskId) {
    AppState.tasks = AppState.tasks.filter(t => t.id !== taskId);
    saveState();
    renderPlanner();
    renderDashboard();
    updateBadgeCounts();
    showToast('Task removed', '🗑️');
  };

  // Attach search and filter event listeners
  ['taskSearchInput', 'taskSubjectFilter', 'taskPriorityFilter', 'taskStatusFilter'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', renderPlanner);
    document.getElementById(id)?.addEventListener('change', renderPlanner);
  });

  // Task Modal Form Submission
  document.getElementById('addTaskForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitleInput').value.trim();
    const subject = document.getElementById('taskSubjectSelect').value;
    const priority = document.getElementById('taskPrioritySelect').value;
    const dueDate = document.getElementById('taskDueDateInput').value || getFormattedDateStr(new Date());
    const estHours = parseFloat(document.getElementById('taskEstHoursInput').value) || 1.0;

    if (!title) return;

    const newTask = {
      id: 't_' + Date.now(),
      title,
      subject,
      priority,
      dueDate,
      estHours,
      completed: false
    };

    AppState.tasks.unshift(newTask);
    saveState();
    closeModal('addTaskModal');
    document.getElementById('addTaskForm').reset();
    renderPlanner();
    renderDashboard();
    updateBadgeCounts();
    showToast('✅ Task added successfully');
  });

  // ==========================================================================
  // 9. FOCUS POMODORO TIMER ENGINE
  // ==========================================================================
  function renderTimerView() {
    updateTimerDisplay();
    document.getElementById('timerSessionsCompleted').textContent = AppState.timer.completedToday;
    document.getElementById('timerTotalTimeToday').textContent = `${AppState.timer.totalMinutesToday} mins`;
  }

  function updateTimerDisplay() {
    const mins = Math.floor(AppState.timer.secondsLeft / 60);
    const secs = AppState.timer.secondsLeft % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const mainDigits = document.getElementById('timerMainDigits');
    const dashTimerDisplay = document.getElementById('dashTimerDisplay');
    const timerRingFill = document.getElementById('timerProgressCircle');

    if (mainDigits) mainDigits.textContent = formatted;
    if (dashTimerDisplay) dashTimerDisplay.textContent = formatted;

    // Circle progress ring math
    if (timerRingFill) {
      const radius = 120;
      const circumference = 2 * Math.PI * radius; // ~753.9
      const ratio = AppState.timer.secondsLeft / AppState.timer.totalDuration;
      const offset = circumference * (1 - ratio);
      timerRingFill.style.strokeDashoffset = offset;
    }
  }

  function toggleTimer() {
    if (AppState.timer.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  function startTimer() {
    if (AppState.timer.isRunning) return;
    AppState.timer.isRunning = true;

    document.getElementById('timerToggleText').textContent = 'Pause Session';
    document.getElementById('timerPlayIcon').innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';

    timerInterval = setInterval(() => {
      if (AppState.timer.secondsLeft > 0) {
        AppState.timer.secondsLeft--;
        updateTimerDisplay();
      } else {
        handleTimerCompletion();
      }
    }, 1000);
  }

  function pauseTimer() {
    AppState.timer.isRunning = false;
    clearInterval(timerInterval);
    document.getElementById('timerToggleText').textContent = 'Resume Session';
    document.getElementById('timerPlayIcon').innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
  }

  function resetTimer() {
    pauseTimer();
    const modeConfig = TIMER_MODES[AppState.timer.mode];
    AppState.timer.secondsLeft = modeConfig.minutes * 60;
    AppState.timer.totalDuration = modeConfig.minutes * 60;
    document.getElementById('timerToggleText').textContent = 'Start Session';
    updateTimerDisplay();
  }

  function handleTimerCompletion() {
    pauseTimer();

    if (AppState.timer.mode === 'focus') {
      AppState.timer.completedToday++;
      AppState.timer.totalMinutesToday += TIMER_MODES.focus.minutes;
      saveState();
      showToast('Focus session completed! Great work 🎉', '⏱️');
    } else {
      showToast('Break finished! Ready to focus again?', '☕');
    }

    renderTimerView();
    renderDashboard();
  }

  // Timer Mode Switchers
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.mode;
      AppState.timer.mode = mode;
      document.getElementById('timerModeText').textContent = TIMER_MODES[mode].label;
      resetTimer();
    });
  });

  document.getElementById('timerToggleBtn')?.addEventListener('click', toggleTimer);
  document.getElementById('timerResetBtn')?.addEventListener('click', resetTimer);

  document.getElementById('dashStartTimerBtn')?.addEventListener('click', () => {
    switchView('timer');
    startTimer();
  });

  document.getElementById('dashGoTimerBtn')?.addEventListener('click', () => switchView('timer'));

  document.getElementById('timerPlus5Btn')?.addEventListener('click', () => {
    AppState.timer.secondsLeft += 300;
    AppState.timer.totalDuration += 300;
    updateTimerDisplay();
  });

  document.getElementById('timerMinus5Btn')?.addEventListener('click', () => {
    if (AppState.timer.secondsLeft > 300) {
      AppState.timer.secondsLeft -= 300;
      AppState.timer.totalDuration -= 300;
      updateTimerDisplay();
    }
  });

  // ==========================================================================
  // 10. HABIT TRACKER ENGINE
  // ==========================================================================
  function renderHabits() {
    const todayStr = getFormattedDateStr(new Date());
    const completedToday = AppState.habits.filter(h => h.completedDates.includes(todayStr)).length;

    document.getElementById('habitSummaryText').textContent = `${completedToday} / ${AppState.habits.length} Habits Completed Today`;

    // 1. Weekly Matrix Table Render
    const tableBody = document.getElementById('habitTableBody');
    if (tableBody) {
      const daysOfWeek = getPastWeekDays(); // Mon-Sun

      tableBody.innerHTML = AppState.habits.map(habit => {
        const streak = calculateHabitStreak(habit);
        const dayCheckCells = daysOfWeek.map(dayObj => {
          const isDone = habit.completedDates.includes(dayObj.dateStr);
          return `
            <td>
              <button class="matrix-check ${isDone ? 'done' : ''}" onclick="toggleHabitDate('${habit.id}', '${dayObj.dateStr}')">
                ${isDone ? '✓' : ''}
              </button>
            </td>
          `;
        }).join('');

        return `
          <tr>
            <td>
              <span class="habit-emoji">${habit.icon}</span> ${escapeHtml(habit.title)}
            </td>
            ${dayCheckCells}
            <td><span class="badge badge-accent">🔥 ${streak}d</span></td>
            <td>
              <button class="task-delete-btn" onclick="deleteHabit('${habit.id}')" title="Delete Habit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // 2. Mobile/Grid Cards Render
    const cardsGrid = document.getElementById('habitCardsGrid');
    if (cardsGrid) {
      if (AppState.habits.length === 0) {
        cardsGrid.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">🌱</div>
            <h3 class="empty-title">Build your first habit today</h3>
            <p class="empty-sub">Small daily actions lead to extraordinary long-term results.</p>
          </div>
        `;
        return;
      }

      cardsGrid.innerHTML = AppState.habits.map(habit => {
        const isDone = habit.completedDates.includes(todayStr);
        const streak = calculateHabitStreak(habit);

        return `
          <div class="glass-card habit-check-card">
            <div class="habit-info-left">
              <span class="habit-emoji">${habit.icon}</span>
              <div>
                <div class="habit-title">${escapeHtml(habit.title)}</div>
                <div class="habit-streak-pill">🔥 ${streak} day streak</div>
              </div>
            </div>
            <button class="custom-checkbox ${isDone ? 'checked' : ''}" onclick="toggleHabitDate('${habit.id}', '${todayStr}')">
              ${isDone ? '✓' : ''}
            </button>
          </div>
        `;
      }).join('');
    }
  }

  function getPastWeekDays() {
    const result = [];
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // Mon=1..Sun=7
    const mon = new Date(now);
    mon.setDate(now.getDate() - (dayOfWeek - 1));

    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      result.push({
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dateStr: getFormattedDateStr(d)
      });
    }
    return result;
  }

  function calculateHabitStreak(habit) {
    let streak = 0;
    let checkDate = new Date();
    while (true) {
      const dateStr = getFormattedDateStr(checkDate);
      if (habit.completedDates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  window.toggleHabitDate = function(habitId, dateStr) {
    const habit = AppState.habits.find(h => h.id === habitId);
    if (habit) {
      if (habit.completedDates.includes(dateStr)) {
        habit.completedDates = habit.completedDates.filter(d => d !== dateStr);
      } else {
        habit.completedDates.push(dateStr);
      }
      saveState();
      renderHabits();
      renderDashboard();
      showToast('Habit updated!', '🌿');
    }
  };

  window.deleteHabit = function(habitId) {
    AppState.habits = AppState.habits.filter(h => h.id !== habitId);
    saveState();
    renderHabits();
    renderDashboard();
    showToast('Habit removed', '🗑️');
  };

  document.getElementById('addHabitForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('habitTitleInput').value.trim();
    const icon = document.getElementById('habitIconSelect').value;

    if (!title) return;

    const newHabit = {
      id: 'h_' + Date.now(),
      title,
      icon,
      completedDates: []
    };

    AppState.habits.push(newHabit);
    saveState();
    closeModal('addHabitModal');
    document.getElementById('addHabitForm').reset();
    renderHabits();
    renderDashboard();
    showToast('✅ Habit created!');
  });

  // ==========================================================================
  // 11. EXPENSE TRACKER ENGINE
  // ==========================================================================
  function renderExpenses() {
    const curr = AppState.settings.currency;
    const weeklyTotal = calculateWeeklyExpenses();

    const monthTotal = AppState.expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    document.getElementById('expTotalWeek').textContent = `${curr}${weeklyTotal}`;
    document.getElementById('expTotalMonth').textContent = `${curr}${monthTotal}`;

    // Category Breakdown Map
    const catTotals = {};
    AppState.expenses.forEach(e => {
      catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount);
    });

    let topCategory = 'None';
    let maxCatAmount = 0;
    Object.keys(catTotals).forEach(cat => {
      if (catTotals[cat] > maxCatAmount) {
        maxCatAmount = catTotals[cat];
        topCategory = cat;
      }
    });

    document.getElementById('expTopCategory').textContent = `${topCategory} (${curr}${maxCatAmount})`;
    document.getElementById('expenseCountLabel').textContent = `${AppState.expenses.length} entries`;

    // Render Category Bars
    const catBarsContainer = document.getElementById('expenseCategoryBars');
    if (catBarsContainer) {
      const categories = ['Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Other'];
      const catColors = {
        Food: '#f59e0b',
        Transport: '#3b82f6',
        Education: '#6366f1',
        Shopping: '#ec4899',
        Entertainment: '#8b5cf6',
        Other: '#64748b'
      };

      catBarsContainer.innerHTML = categories.map(cat => {
        const amt = catTotals[cat] || 0;
        const pct = monthTotal > 0 ? ((amt / monthTotal) * 100).toFixed(1) : 0;
        return `
          <div class="cat-bar-item">
            <div class="cat-bar-header">
              <span>${cat}</span>
              <span>${curr}${amt} (${pct}%)</span>
            </div>
            <div class="cat-bar-track">
              <div class="cat-bar-fill" style="width: ${pct}%; background: ${catColors[cat]};"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render Recent Transactions
    const listContainer = document.getElementById('expenseListContainer');
    if (listContainer) {
      if (AppState.expenses.length === 0) {
        listContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">💳</div>
            <h3 class="empty-title">No expenses recorded yet</h3>
            <p class="empty-sub">Keep track of your daily pocket money, canteen lunches, and books.</p>
          </div>
        `;
        return;
      }

      const categoryEmojis = {
        Food: '🍔', Transport: '🚌', Education: '📚', Shopping: '🛍️', Entertainment: '🎮', Other: '📦'
      };

      listContainer.innerHTML = AppState.expenses.map(exp => `
        <div class="expense-item">
          <div class="exp-item-left">
            <span class="exp-cat-icon">${categoryEmojis[exp.category] || '📦'}</span>
            <div>
              <div class="exp-desc">${escapeHtml(exp.description)}</div>
              <div class="exp-date">${exp.date} • ${exp.category}</div>
            </div>
          </div>
          <div class="exp-item-right">
            <span class="exp-amount">-${curr}${exp.amount}</span>
            <button class="task-delete-btn" onclick="deleteExpense('${exp.id}')" title="Delete Expense">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `).join('');
    }
  }

  window.deleteExpense = function(expId) {
    AppState.expenses = AppState.expenses.filter(e => e.id !== expId);
    saveState();
    renderExpenses();
    renderDashboard();
    showToast('Expense deleted', '🗑️');
  };

  document.getElementById('addExpenseForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('expDescInput').value.trim();
    const amount = parseFloat(document.getElementById('expAmountInput').value);
    const category = document.getElementById('expCategorySelect').value;
    const date = document.getElementById('expDateInput').value || getFormattedDateStr(new Date());

    if (!description || !amount) return;

    const newExpense = {
      id: 'e_' + Date.now(),
      description,
      amount,
      category,
      date
    };

    AppState.expenses.unshift(newExpense);
    saveState();
    closeModal('addExpenseModal');
    document.getElementById('addExpenseForm').reset();
    renderExpenses();
    renderDashboard();
    showToast('💰 Expense added!');
  });

  // Set default date input value to today
  const expDateInput = document.getElementById('expDateInput');
  if (expDateInput) expDateInput.value = getFormattedDateStr(new Date());

  // ==========================================================================
  // 12. ANALYTICS ENGINE
  // ==========================================================================
  function renderAnalytics() {
    const curr = AppState.settings.currency;

    // Study Metrics
    document.getElementById('anTotalStudyHrs').textContent = `${(AppState.timer.totalMinutesToday / 60).toFixed(1)} hrs`;
    document.getElementById('anTotalSessions').textContent = AppState.timer.completedToday;
    document.getElementById('anAvgDailyStudy').textContent = `${(AppState.timer.totalMinutesToday / 60).toFixed(1)} hrs/day`;

    // Task Metrics
    const completedTasks = AppState.tasks.filter(t => t.completed).length;
    const pendingTasks = AppState.tasks.filter(t => !t.completed).length;
    const totalTasks = AppState.tasks.length;
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    document.getElementById('anCompletedTasksCount').textContent = completedTasks;
    document.getElementById('anPendingTasksCount').textContent = pendingTasks;
    document.getElementById('anCompletionRate').textContent = `${completionRate}%`;

    const taskProgressFill = document.getElementById('analyticsTaskProgressFill');
    if (taskProgressFill) taskProgressFill.style.width = `${completionRate}%`;

    // Habit Metrics
    const currentStreak = calculateBestStreak();
    document.getElementById('anCurrentHabitStreak').textContent = `${currentStreak} Days`;
    document.getElementById('anBestHabitStreak').textContent = `${currentStreak > 14 ? currentStreak : 14} Days`;

    // Financial Metrics
    const totalSpent = AppState.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    document.getElementById('anTotalSpentAll').textContent = `${curr}${totalSpent}`;

    // Subject Chart Render
    const subjectHours = {};
    AppState.tasks.forEach(t => {
      subjectHours[t.subject] = (subjectHours[t.subject] || 0) + (t.completed ? (t.estHours || 1) : 0);
    });

    const subjectChart = document.getElementById('analyticsSubjectChart');
    if (subjectChart) {
      const keys = Object.keys(subjectHours);
      if (keys.length === 0) {
        subjectChart.innerHTML = `<p class="text-secondary text-sm">No study logs available yet.</p>`;
      } else {
        const maxHr = Math.max(...Object.values(subjectHours), 1);
        subjectChart.innerHTML = keys.map(subj => {
          const hrs = subjectHours[subj];
          const pct = ((hrs / maxHr) * 100).toFixed(1);
          return `
            <div class="cat-bar-item">
              <div class="cat-bar-header">
                <span>${subj}</span>
                <span>${hrs} hrs</span>
              </div>
              <div class="cat-bar-track">
                <div class="cat-bar-fill bg-indigo" style="width: ${pct}%;"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  // ==========================================================================
  // 13. SETTINGS & PROFILE ENGINE
  // ==========================================================================
  function renderSettings() {
    document.getElementById('settingStudentName').value = AppState.profile.name;
    document.getElementById('settingCollegeName').value = AppState.profile.college;
    document.getElementById('settingCourseName').value = AppState.profile.course;
    document.getElementById('settingCurrencySelect').value = AppState.settings.currency;
    document.getElementById('settingToastToggle').checked = AppState.settings.notificationsEnabled;
  }

  document.getElementById('profileForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    AppState.profile.name = document.getElementById('settingStudentName').value.trim();
    AppState.profile.college = document.getElementById('settingCollegeName').value.trim();
    AppState.profile.course = document.getElementById('settingCourseName').value.trim();

    saveState();
    updateUserProfileDisplay();
    showToast('Profile updated!', '👤');
  });

  document.getElementById('settingCurrencySelect')?.addEventListener('change', (e) => {
    AppState.settings.currency = e.target.value;
    saveState();
    showToast(`Currency updated to ${e.target.value}`, '💱');
  });

  document.getElementById('settingToastToggle')?.addEventListener('change', (e) => {
    AppState.settings.notificationsEnabled = e.target.checked;
    saveState();
  });

  function updateUserProfileDisplay() {
    const initials = AppState.profile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    document.getElementById('sidebarAvatar').textContent = initials || 'AR';
    document.getElementById('sidebarUserName').textContent = AppState.profile.name;
    document.getElementById('sidebarUserCourse').textContent = AppState.profile.course;
  }

  // Data Reset & Demo Data Listeners
  document.getElementById('loadDemoDataBtn')?.addEventListener('click', () => {
    seedDefaultData();
    saveState();
    renderViewContent(getCurrentViewId());
    updateUserProfileDisplay();
    showToast('Demo data reloaded!', '🔄');
  });

  document.getElementById('resetDataBtn')?.addEventListener('click', () => {
    openConfirmModal(
      'Reset All Application Data?',
      'This will permanently delete all your tasks, habits, and expenses.',
      () => {
        localStorage.removeItem(STORAGE_KEY);
        AppState.tasks = [];
        AppState.habits = [];
        AppState.expenses = [];
        AppState.timer.completedToday = 0;
        AppState.timer.totalMinutesToday = 0;
        saveState();
        renderViewContent(getCurrentViewId());
        showToast('All application data cleared', '🗑️');
      }
    );
  });

  function getCurrentViewId() {
    const activeSec = document.querySelector('.view-section.active');
    return activeSec ? activeSec.id.replace('view-', '') : 'dashboard';
  }

  // ==========================================================================
  // 14. MODAL DIALOGS SYSTEM
  // ==========================================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.dataset.closeModal);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  document.getElementById('quickAddBtn')?.addEventListener('click', () => openModal('addTaskModal'));
  document.getElementById('openAddTaskModalBtn')?.addEventListener('click', () => openModal('addTaskModal'));
  document.getElementById('openAddHabitModalBtn')?.addEventListener('click', () => openModal('addHabitModal'));
  document.getElementById('openAddExpenseModalBtn')?.addEventListener('click', () => openModal('addExpenseModal'));

  // Confirm Modal Callback Helper
  let onConfirmCallback = null;

  function openConfirmModal(title, message, callback) {
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalMessage').textContent = message;
    onConfirmCallback = callback;
    openModal('confirmModal');
  }

  document.getElementById('confirmOkBtn')?.addEventListener('click', () => {
    if (onConfirmCallback) onConfirmCallback();
    closeModal('confirmModal');
  });

  document.getElementById('confirmCancelBtn')?.addEventListener('click', () => closeModal('confirmModal'));

  // Esc key listener for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });

  // ==========================================================================
  // 15. INITIAL APPLICATION BOOTSTRAP
  // ==========================================================================
  function initApp() {
    initStorage();
    applyTheme(AppState.settings.theme);
    updateUserProfileDisplay();

    // Check hash URL or default to dashboard
    const initialView = window.location.hash.replace('#', '') || 'dashboard';
    switchView(initialView);
  }

  initApp();
});
