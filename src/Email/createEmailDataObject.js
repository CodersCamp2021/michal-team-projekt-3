export const createEmailDataObject = (
  emailTo,
  emailSubject,
  emailHTMLcontent,
) => {
  return {
    from: `"Bking" <noreply.bking@gmail.com>`,
    to: emailTo,
    subject: emailSubject,
    html: emailHTMLcontent,
  };
};
