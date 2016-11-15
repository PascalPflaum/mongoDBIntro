module.exports = function () {

    var score = 0;

    for (var key in this.skills) {
        if (
            Object.prototype.hasOwnProperty.call(this.skills, key) &&
            Object.prototype.hasOwnProperty.call(searchedSkills, key)
        ) {
            score += this.skills[key] * searchedSkills[key];
        }
    }

    emit(this._id, score / maximumScore);
};