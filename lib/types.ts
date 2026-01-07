export interface Todo {
  id: string
  title: string
  completed: boolean
  user_identifier: string
  created_at: string
  updated_at: string
}

export interface CreateTodoInput {
  title: string
  user_identifier: string
}

export interface UpdateTodoInput {
  id: string
  title?: string
  completed?: boolean
}
