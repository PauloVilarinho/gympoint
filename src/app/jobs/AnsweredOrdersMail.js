import Mail from '../../lib/Mail';

class AnsweredOrdersMail {
  get key() {
    return 'AnsweredOrdersMail';
  }

  async handle({ data }) {
    const { student, helpOrder } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Pergunta Respondida',
      template: 'answered',
      context: {
        student: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new AnsweredOrdersMail();
