// Hey friends! You are welcome to edit this email content on github.com

const emailSubject = 'Permission to submit order via tutorial.rye.com';

const emailBody = `Hey Rye Team! 👋

I'm an innovator in the eCommerce space.

I am interested in testing the checkout step on tutorial.rye.com.

I'm building an app that ____

P.S. I would really love an api that allows me to ____

Thanks!`;

export const emailTo = 'dev@rye.com';

export const emailToTestCheckoutHref = [
  `mailto:${emailTo}`,
  `?subject=${encodeURIComponent(emailSubject)}`,
  `&body=${encodeURIComponent(emailBody)}`,
].join('');
