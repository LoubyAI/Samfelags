/**
 * Owner Configuration
 * Owner email is stored in a simple in-memory config
 * Can be updated via admin panel later
 */

window.ownerConfig = {
  ownerEmail: "louby7@gmail.com", // Can be changed from admin settings

  /**
   * Check if the given email belongs to the owner
   * @param {string} email - Email to check
   * @returns {boolean} True if email is owner email
   */
  isOwner(email) {
    return email && email.toLowerCase() === this.ownerEmail.toLowerCase();
  },
};
