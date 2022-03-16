export const templateEmailWithoutButton = (title, desc) => {
  return `
  <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
  style="@import url(https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;500&display=swap); font-family: 'Open Sans', sans-serif;">
  <tr>
    <td>
      <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
        <tr>
          <td style="height:20px;">&nbsp;</td>
        </tr>
        <tr>
          <td style="text-align:center;">
            <img width="60" src="https://i.ibb.co/mhBtq5m/logo.png" title="logo" alt="logo">
          </td>
        </tr>
        <tr>
          <td style="height:20px;">&nbsp;</td>
        </tr>
        <tr>
          <td>
            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
              <tr>
                <td style="height:40px;">&nbsp;</td>
              </tr>
              <tr>
                <td style="padding:0 35px;">
                  <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                    ${title}
                  </h1>
                  <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                  <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                    ${desc}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="height:40px;">&nbsp;</td>
              </tr>
            </table>
          </td>
        <tr>
          <td style="height:20px;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
  `;
};
