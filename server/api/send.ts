import { Resend } from 'resend';





export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  if (!runtimeConfig.resend_api_key) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  const resend = new Resend(`${runtimeConfig.resend_api_key}`);

  const body = await readBody(event);

  try {
    const data = await resend.emails.send({
      from: 'Tela Invite <invite@tela.design>',
      to: [body.email],
      subject: 'Invite to join the design file as a collaborator',
      html: '<strong>Join the desing file as a collaborator: <a href="https://tela-delta.vercel.app">Here is the invite link</a></strong>',
    });

    return data;
  } catch (error) {
    return { error };
  }
});