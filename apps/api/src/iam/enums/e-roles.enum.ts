export enum ERoles {
  //accounts owners

  TEAM_USER = 'team_user',
  PREMIUM_USER = 'premium_user',
  GUEST_USER = 'guest_user',
  FREE_USER = 'free_user',
  STANDARD_USER = 'standard_user',

  //Teams
  MEMBER = 'member',
  MANAGER = 'manager',

  //admins(special owner since they are the root admin)
  ADMIN = 'admin',
  ADMIN_ASSISTANT = 'admin_assistant',
  ADMIN_MANAGER = 'admin_manager',
}

export enum EPremiumSubscribers {
  TEAM_USER = ERoles.TEAM_USER,
  PREMIUM_USER = ERoles.PREMIUM_USER,
  GUEST_USER = ERoles.GUEST_USER,
  ADMIN = ERoles.ADMIN,
}
