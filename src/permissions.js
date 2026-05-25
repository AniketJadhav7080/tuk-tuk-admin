export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
  SUPPORT: 'support',
  COUNTRY_HANDLER: 'country_handler',
  DIAMOND_STOCK: 'diamond_stock',
  AGENCY: 'agency',
  HOST: 'host',
}

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_COUNTRY_DASHBOARD: 'view_country_dashboard',
  VIEW_HOST_DASHBOARD: 'view_host_dashboard',
  VIEW_DIAMOND_DASHBOARD: 'view_diamond_dashboard',
  VIEW_AGENCY_DASHBOARD: 'view_agency_dashboard',

  // Users
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',
  BAN_USERS: 'ban_users',
  EDIT_USERS: 'edit_users',
  VERIFY_VIP: 'verify_vip',

  // Hosts
  MANAGE_HOSTS: 'manage_hosts',
  VIEW_HOSTS: 'view_hosts',
  APPROVE_HOSTS: 'approve_hosts',

  // Rooms
  MONITOR_ROOMS: 'monitor_rooms',
  CLOSE_ROOMS: 'close_rooms',
  MUTE_KICK: 'mute_kick',
  VOICE_MONITOR: 'voice_monitor',

  // Reports
  VIEW_REPORTS: 'view_reports',
  RESOLVE_REPORTS: 'resolve_reports',

  // Notifications
  SEND_NOTIFICATIONS: 'send_notifications',

  // Admins
  MANAGE_ADMINS: 'manage_admins',

  // Settings
  VIEW_SETTINGS: 'view_settings',
  EDIT_SETTINGS: 'edit_settings',

  // Diamond & Coins
  MANAGE_DIAMOND: 'manage_diamond',
  APPROVE_RECHARGE: 'approve_recharge',
  VIEW_TRANSACTIONS: 'view_transactions',
  DISTRIBUTE_AGENTS: 'distribute_agents',

  // Gifts
  MANAGE_GIFTS: 'manage_gifts',

  // Agency
  MANAGE_AGENCY: 'manage_agency',
  RECRUIT_HOSTS: 'recruit_hosts',
  VIEW_COMMISSIONS: 'view_commissions',
  VIEW_SALARIES: 'view_salaries',

  // Host Panel
  VIEW_EARNINGS: 'view_earnings',
  WITHDRAW_REQUEST: 'withdraw_request',
  VIEW_PK_BATTLES: 'view_pk_battles',
  VIEW_FOLLOWERS: 'view_followers',

  // Support
  MANAGE_TICKETS: 'manage_tickets',
  VIEW_TICKETS: 'view_tickets',
  LIVE_CHAT_SUPPORT: 'live_chat_support',

  // Security
  VIEW_SECURITY: 'view_security',
  ANTI_FRAUD: 'anti_fraud',

  // Events
  MANAGE_EVENTS: 'manage_events',

  // Payments
  MANAGE_PAYMENTS: 'manage_payments',

  // Live Monitoring
  LIVE_MONITORING: 'live_monitoring',

  // Country Handler
  LOCAL_USER_SUPPORT: 'local_user_support',
  COUNTRY_REVENUE: 'country_revenue',
}

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

  [ROLES.MODERATOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS, PERMISSIONS.BAN_USERS, PERMISSIONS.EDIT_USERS, PERMISSIONS.VERIFY_VIP,
    PERMISSIONS.MONITOR_ROOMS, PERMISSIONS.CLOSE_ROOMS, PERMISSIONS.MUTE_KICK, PERMISSIONS.VOICE_MONITOR,
    PERMISSIONS.VIEW_REPORTS, PERMISSIONS.RESOLVE_REPORTS,
    PERMISSIONS.SEND_NOTIFICATIONS,
    PERMISSIONS.VIEW_HOSTS, PERMISSIONS.APPROVE_HOSTS,
  ],

  [ROLES.SUPPORT]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_TICKETS, PERMISSIONS.LIVE_CHAT_SUPPORT,
    PERMISSIONS.SEND_NOTIFICATIONS,
  ],

  [ROLES.COUNTRY_HANDLER]: [
    PERMISSIONS.VIEW_COUNTRY_DASHBOARD,
    PERMISSIONS.VIEW_HOSTS,
    PERMISSIONS.MONITOR_ROOMS, PERMISSIONS.CLOSE_ROOMS, PERMISSIONS.MUTE_KICK,
    PERMISSIONS.LOCAL_USER_SUPPORT,
    PERMISSIONS.COUNTRY_REVENUE,
    PERMISSIONS.SEND_NOTIFICATIONS,
  ],

  [ROLES.DIAMOND_STOCK]: [
    PERMISSIONS.VIEW_DIAMOND_DASHBOARD,
    PERMISSIONS.MANAGE_DIAMOND,
    PERMISSIONS.APPROVE_RECHARGE,
    PERMISSIONS.VIEW_TRANSACTIONS,
    PERMISSIONS.DISTRIBUTE_AGENTS,
  ],

  [ROLES.AGENCY]: [
    PERMISSIONS.VIEW_AGENCY_DASHBOARD,
    PERMISSIONS.RECRUIT_HOSTS,
    PERMISSIONS.VIEW_COMMISSIONS,
    PERMISSIONS.VIEW_SALARIES,
    PERMISSIONS.VIEW_HOSTS,
  ],

  [ROLES.HOST]: [
    PERMISSIONS.VIEW_HOST_DASHBOARD,
    PERMISSIONS.VIEW_EARNINGS,
    PERMISSIONS.WITHDRAW_REQUEST,
    PERMISSIONS.VIEW_PK_BATTLES,
    PERMISSIONS.VIEW_FOLLOWERS,
    PERMISSIONS.MONITOR_ROOMS,
  ],
}

export function hasPermission(user, permission) {
  if (!user) return false
  if (user.role === ROLES.SUPER_ADMIN) return true
  const perms = ROLE_PERMISSIONS[user.role]
  return perms?.includes(permission) ?? false
}

export function canAccessRoute(user, route) {
  const dashboardPerms = [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_COUNTRY_DASHBOARD,
    PERMISSIONS.VIEW_DIAMOND_DASHBOARD,
    PERMISSIONS.VIEW_AGENCY_DASHBOARD,
    PERMISSIONS.VIEW_HOST_DASHBOARD,
  ]
  const routeMap = {
    '/': dashboardPerms,
    '/users': PERMISSIONS.VIEW_USERS,
    '/users/': PERMISSIONS.VIEW_USERS,
    '/hosts': PERMISSIONS.VIEW_HOSTS,
    '/rooms': PERMISSIONS.MONITOR_ROOMS,
    '/reports': PERMISSIONS.VIEW_REPORTS,
    '/notifications': PERMISSIONS.SEND_NOTIFICATIONS,
    '/admins': PERMISSIONS.MANAGE_ADMINS,
    '/settings': PERMISSIONS.VIEW_SETTINGS,
    '/diamond-coin': PERMISSIONS.VIEW_DIAMOND_DASHBOARD,
    '/gifts': PERMISSIONS.MANAGE_GIFTS,
    '/agency': PERMISSIONS.MANAGE_AGENCY,
    '/host-panel': PERMISSIONS.VIEW_HOST_DASHBOARD,
    '/country': PERMISSIONS.VIEW_COUNTRY_DASHBOARD,
    '/diamond-stock': PERMISSIONS.VIEW_DIAMOND_DASHBOARD,
    '/tickets': PERMISSIONS.VIEW_TICKETS,
    '/security': PERMISSIONS.VIEW_SECURITY,
    '/events': PERMISSIONS.MANAGE_EVENTS,
    '/payments': PERMISSIONS.MANAGE_PAYMENTS,
    '/live': PERMISSIONS.LIVE_MONITORING,
  }
  const key = Object.keys(routeMap).find((k) => route.startsWith(k))
  if (!key) return true
  const perm = routeMap[key]
  if (Array.isArray(perm)) return perm.some((p) => hasPermission(user, p))
  return hasPermission(user, perm)
}
