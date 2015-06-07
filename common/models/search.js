module.exports = function(Search) {
  Search.afterCreate = function(next) {
    next();
  };
};
