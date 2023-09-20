const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config();

class NodeMailer{
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {

                user:  process.env.USERS,
                pass:   process.env.PASS,
            },
            debug: true
        });

    }
    async sendMail(to,data){
        await this.transporter.sendMail({
            from: process.env.USERS,
            to,
            subject: "Ваш заказ получен",
            text: '',
            html:
                `
                    <h2>${data.name}</h2>
                    <h3>${data.surname}</h3>
                    <h4>${data.email}</h4>
                    <h5>${data.phone}</h5>
                    <h6>${data.address}</h6>
                    ${data.products.map(product => {
                        return `
                        <span class="card mb-3">
  
  <div class="card-body">
    <div class="d-flex justify-content-between">
      <div class="d-flex flex-row align-items-center">
        <div>
          <img src="${product.image_url}" class="img-fluid rounded-3" alt="Shopping item" style="width: auto;">
        </div>
        <div class="ms-3">
          <h5>${product.name}</h5>
        </div>
      </div>
      <div class="d-flex flex-row align-items-center">
        <div style="width: 80px;">
          <h5 class="mb-0">${product.cost} грн</h5>
        </div>
      </div>
    </div>
  </div>
</span>
`
                })}
                `
        });

    }
}
module.exports = new NodeMailer();