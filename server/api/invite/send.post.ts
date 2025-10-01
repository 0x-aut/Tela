import { Resend } from 'resend';

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const resend = new Resend(runtimeConfig.resendApiKey);

  const body = await readBody(event);

  if (!body.email || !body.shareLink) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and share link are required',
    });
  }

  try {
    const inviteLink = `https://tela-delta.vercel.app/design/${body.shareLink}`;

    const data = await resend.emails.send({
      from: 'Tela Invite <invite@tela.design>',
      to: [body.email],
      subject: 'Invite to join the design file as a collaborator',
      html: `<strong>Join the design file as a collaborator: <a href="${inviteLink}">Here is the invite link</a></strong>`,
    });

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to send invite email',
    });
  }
});
