import { db } from '#shared/db/connection.js'
import {
  boardsTable,
  columnsTable,
  labelsTable,
  subtasksTable,
  taskLabelsTable,
  tasksTable,
} from '#shared/db/schema.js'
import { sql } from 'drizzle-orm'

// Clear existing data (reverse FK order)
db.run(sql`DELETE FROM ${taskLabelsTable}`)
db.run(sql`DELETE FROM ${subtasksTable}`)
db.run(sql`DELETE FROM ${tasksTable}`)
db.run(sql`DELETE FROM ${columnsTable}`)
db.run(sql`DELETE FROM ${labelsTable}`)
db.run(sql`DELETE FROM ${boardsTable}`)

console.log('Cleared existing data.')

// Board
const boardId = crypto.randomUUID()
await db.insert(boardsTable).values({ id: boardId, name: 'Development' })

// Columns
const todoColId = crypto.randomUUID()
const inProgressColId = crypto.randomUUID()
const doneColId = crypto.randomUUID()

await db.insert(columnsTable).values([
  { boardId, id: todoColId, name: 'To Do', position: 0 },
  { boardId, id: inProgressColId, name: 'In Progress', position: 1 },
  { boardId, id: doneColId, name: 'Done', position: 2 },
])

// Labels
const frontendLabelId = crypto.randomUUID()
const backendLabelId = crypto.randomUUID()
const urgentLabelId = crypto.randomUUID()

await db.insert(labelsTable).values([
  { color: '#3b82f6', id: frontendLabelId, name: 'Frontend' },
  { color: '#10b981', id: backendLabelId, name: 'Backend' },
  { color: '#ef4444', id: urgentLabelId, name: 'Urgent' },
])

// Tasks
const task1Id = crypto.randomUUID()
const task2Id = crypto.randomUUID()
const task3Id = crypto.randomUUID()
const task4Id = crypto.randomUUID()
const task5Id = crypto.randomUUID()
const templateTaskId = crypto.randomUUID()

await db.insert(tasksTable).values([
  {
    assignee: 'Trevor',
    columnId: todoColId,
    description: 'Fix the login page not redirecting after authentication',
    id: task1Id,
    position: 0,
    priority: 'high',
    title: 'Fix login redirect bug',
    type: 'bug',
  },
  {
    assignee: 'Trevor',
    columnId: todoColId,
    description: 'Add dark mode toggle to the settings page',
    dueDate: '2026-04-20',
    id: task2Id,
    position: 1,
    priority: 'medium',
    title: 'Add dark mode support',
    type: 'feature',
  },
  {
    assignee: null,
    columnId: inProgressColId,
    description: 'As a user, I want to filter tasks by priority so I can focus on what matters',
    id: task3Id,
    position: 0,
    priority: 'medium',
    title: 'User story: task filtering',
    type: 'story',
  },
  {
    assignee: 'Trevor',
    columnId: inProgressColId,
    description: 'Set up the API client layer with fetch wrapper',
    id: task4Id,
    position: 1,
    priority: 'low',
    title: 'Wire up frontend API layer',
    type: 'task',
  },
  {
    assignee: 'Trevor',
    columnId: doneColId,
    description: 'Define all 7 tables using Drizzle ORM',
    id: task5Id,
    position: 0,
    priority: 'high',
    title: 'Set up database schema',
    type: 'task',
  },
  {
    columnId: todoColId,
    description: 'Template: describe the bug, steps to reproduce, expected vs actual behavior',
    id: templateTaskId,
    isTemplate: true,
    position: 2,
    priority: 'high',
    title: 'Bug Report Template',
    type: 'bug',
  },
])

// Subtasks
await db.insert(subtasksTable).values([
  { position: 0, taskId: task1Id, title: 'Reproduce the bug' },
  { position: 1, taskId: task1Id, title: 'Identify root cause' },
  { position: 2, taskId: task1Id, title: 'Write fix and test' },
  { isComplete: true, position: 0, taskId: task4Id, title: 'Create fetch wrapper' },
  { isComplete: true, position: 1, taskId: task4Id, title: 'Create board API functions' },
  { position: 2, taskId: task4Id, title: 'Create task API functions' },
  { position: 3, taskId: task4Id, title: 'Wire up loaders' },
])

// Task-Label associations
await db.insert(taskLabelsTable).values([
  { labelId: frontendLabelId, taskId: task1Id },
  { labelId: urgentLabelId, taskId: task1Id },
  { labelId: frontendLabelId, taskId: task2Id },
  { labelId: backendLabelId, taskId: task3Id },
  { labelId: frontendLabelId, taskId: task4Id },
  { labelId: backendLabelId, taskId: task4Id },
  { labelId: backendLabelId, taskId: task5Id },
])

// ============================================================
// Board 2: Chores
// ============================================================

const choresId = crypto.randomUUID()
await db.insert(boardsTable).values({ id: choresId, name: 'Chores' })

// Columns
const pendingColId = crypto.randomUUID()
const ongoingColId = crypto.randomUUID()
const completedColId = crypto.randomUUID()

await db.insert(columnsTable).values([
  { boardId: choresId, id: pendingColId, name: 'Pending', position: 0 },
  { boardId: choresId, id: ongoingColId, name: 'Ongoing', position: 1 },
  { boardId: choresId, id: completedColId, name: 'Completed', position: 2 },
])

// Labels
const houseLabelId = crypto.randomUUID()
const billsLabelId = crypto.randomUUID()
const maintenanceLabelId = crypto.randomUUID()

await db.insert(labelsTable).values([
  { color: '#f59e0b', id: houseLabelId, name: 'House' },
  { color: '#8b5cf6', id: billsLabelId, name: 'Bills' },
  { color: '#06b6d4', id: maintenanceLabelId, name: 'Maintenance' },
])

// Tasks
const chore1Id = crypto.randomUUID()
const chore2Id = crypto.randomUUID()
const chore3Id = crypto.randomUUID()
const chore4Id = crypto.randomUUID()
const chore5Id = crypto.randomUUID()
const chore6Id = crypto.randomUUID()

await db.insert(tasksTable).values([
  {
    columnId: pendingColId,
    description: 'Electricity bill due on 15th April',
    dueDate: '2026-04-15',
    id: chore1Id,
    position: 0,
    priority: 'high',
    title: 'Pay electricity bill',
    type: 'task',
  },
  {
    columnId: pendingColId,
    description: 'AC unit making strange noise, schedule a technician',
    id: chore2Id,
    position: 1,
    priority: 'medium',
    title: 'Fix air conditioner',
    type: 'bug',
  },
  {
    columnId: pendingColId,
    description: 'Deep clean the kitchen including oven and fridge',
    id: chore3Id,
    position: 2,
    priority: 'low',
    title: 'Deep clean kitchen',
    type: 'task',
  },
  {
    columnId: ongoingColId,
    description: 'Compare rates and switch internet provider if cheaper option found',
    dueDate: '2026-04-30',
    id: chore4Id,
    position: 0,
    priority: 'medium',
    title: 'Review internet plan',
    type: 'story',
  },
  {
    assignee: 'Trevor',
    columnId: ongoingColId,
    description: 'Replace water filter cartridge in the kitchen',
    id: chore5Id,
    position: 1,
    priority: 'high',
    title: 'Replace water filter',
    type: 'task',
  },
  {
    assignee: 'Trevor',
    columnId: completedColId,
    description: 'Paid via bank transfer on 1st April',
    id: chore6Id,
    position: 0,
    priority: 'high',
    title: 'Pay rent for April',
    type: 'task',
  },
])

// Subtasks
await db.insert(subtasksTable).values([
  { position: 0, taskId: chore1Id, title: 'Check meter reading' },
  { position: 1, taskId: chore1Id, title: 'Log in to provider portal' },
  { position: 2, taskId: chore1Id, title: 'Make payment' },
  { position: 0, taskId: chore2Id, title: 'Find a local technician' },
  { position: 1, taskId: chore2Id, title: 'Schedule appointment' },
  { position: 2, taskId: chore2Id, title: 'Get quote before repair' },
  { position: 0, taskId: chore3Id, title: 'Clean oven' },
  { position: 1, taskId: chore3Id, title: 'Clean fridge' },
  { position: 2, taskId: chore3Id, title: 'Clean countertops and sink' },
  { isComplete: true, position: 0, taskId: chore4Id, title: 'List current plan details' },
  { position: 1, taskId: chore4Id, title: 'Compare with 3 competitors' },
  { position: 2, taskId: chore4Id, title: 'Call provider to negotiate or switch' },
  { isComplete: true, position: 0, taskId: chore5Id, title: 'Buy replacement cartridge' },
  { position: 1, taskId: chore5Id, title: 'Turn off water supply' },
  { position: 2, taskId: chore5Id, title: 'Swap cartridge and test' },
  { isComplete: true, position: 0, taskId: chore6Id, title: 'Transfer rent amount' },
  { isComplete: true, position: 1, taskId: chore6Id, title: 'Save receipt' },
])

// Task-Label associations
await db.insert(taskLabelsTable).values([
  { labelId: billsLabelId, taskId: chore1Id },
  { labelId: urgentLabelId, taskId: chore1Id },
  { labelId: maintenanceLabelId, taskId: chore2Id },
  { labelId: houseLabelId, taskId: chore3Id },
  { labelId: billsLabelId, taskId: chore4Id },
  { labelId: maintenanceLabelId, taskId: chore5Id },
  { labelId: houseLabelId, taskId: chore5Id },
  { labelId: billsLabelId, taskId: chore6Id },
])

console.log('Seed complete.')