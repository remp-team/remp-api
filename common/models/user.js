module.exports = function(user) {
  user.afterCreate = function(next) {
    this.inbox.create({}, function(err, obj){
      next();
    });
  };
};
