/**
 * @typedef {Object} UserProfile
 * @property {number} id - User ID
 * @property {string} username - User login name
 * @property {string} email - User email address
 * @property {string} role - Role enum (EMPLOYEE | ADMIN)
 * @property {string} date - Creation timestamp
 */

/**
 * @typedef {Object} UserUpdateRequest
 * @property {string} [username] - Optional updated username
 * @property {string} [email] - Optional updated email
 * @property {string} [password] - Optional updated password
 */

export {};
