const UserTypes = () => `
  type User {
    _id: String
    name: String
    email: String
    role: String
    photo: String
    clerance: [String!]
    notifications: [String!]
    tasks: [String!]
  }

  input UserInputType {
    name: String!
  }

  type NotificationCount {
    count: Int
  }

  type Notification {
    notificationID: String
    notificationType: String
    readed: Boolean
    notificationTitle: String
    notificationContent: String
  }

  type Task {
    taskID: String
    taskType: String
    done: Boolean
    taskTitle: String
    taskContent: String
  }

  type UserNotification {
    notifications: [Notification]
  }

  type UserTask {
    tasks: [Task]
  }

  type UserListType {
    totalCount: Int
    data: [User]
  }
  type UserSuccess {
    ok: Boolean!,
    message: String!
  }
  extend type Query {
    getUser(id: ID!): User
    getUserNotificationCount(id: String): NotificationCount
    getUserUnreadedNotifications(id: String): UserNotification
    getUserUndoneTasks(id: String): UserTask
    getAllUsers: UserListType
    userTest: Success!
  }
  extend type Mutation {
    addUser(input: UserInputType!): UserSuccess!
    updateUser(id: ID!, input: UserInputType!): UserSuccess!
    deleteUser(id: ID!): UserSuccess!
  }
`

module.exports = {
  UserTypes: UserTypes()
}
