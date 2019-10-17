import { Model, Sequelize } from 'sequelize';

class Checkin extends Model {
  static init(sequelize) {
    super.init(
      { created_at: Sequelize.DATE },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}

export default Checkin;
