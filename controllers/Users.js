
class UserController {
  constructor() {
    this.users = [];
  }
  // eslint-disable-next-line class-methods-use-this
  async save(options) {
    this.users.push(options);
    return options;
  }

  // eslint-disable-next-line class-methods-use-this
  list() {
    return this.users;
  }
}

module.exports = UserController;
