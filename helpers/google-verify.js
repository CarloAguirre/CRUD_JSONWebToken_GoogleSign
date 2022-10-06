import {OAuth2Client} from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  //const payload = ticket.getPayload();

  const {name, picture, email} = ticket.getPayload();
  
  //renombraremos estos datos tal como estan en nuestro modelo de mongoose
  return {
    nombre: name,
    img: picture,
    correo: email}

}

export{googleVerify};