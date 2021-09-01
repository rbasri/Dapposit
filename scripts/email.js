const emailjs = require("emailjs-com");
user_token = 'user_R5pRJFKMbFVOqLbK12aqN';
template_id = 'template_nip7fpi';
service_id = 'service_9e3myms';

const templateParams = {
    from_name: 'Ross',
    to_name: 'Noah',
    message: 'sup',
    to_email: 'rsb2158@gmail.com'
};

document.getElementById("send").addEventListener("click", () => {
    emailjs.send(service_id, template_id, templateParams, user_token);
});

