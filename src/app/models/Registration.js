import { Model, Sequelize } from 'sequelize';
import { addMonths } from 'date-fns';
import Plan from './Plan';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async registration => {
      const plan = await Plan.findByPk(registration.plan_id);

      registration.end_date = addMonths(registration.start_date, plan.duration);
      registration.price = plan.price * plan.duration;
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Registration;
