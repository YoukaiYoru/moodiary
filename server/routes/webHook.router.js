// routes/webhook.router.js
const express = require('express');
const { verifyWebhook } = require('@clerk/express/webhooks');
const { models } = require('../libs/sequelize');

const router = express.Router();

router.post('/', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const evt = await verifyWebhook(req);
    console.log('Webhook verificado:', evt.type);

    const { type, data } = evt;
    const userId = data.id;

    if (type === 'user.created') {
      const displayName =
        data.username ||
        data.first_name ||
        data.email_addresses?.[0]?.email_address?.split('@')[0] ||
        'SinNombre';

      await models.UserProfile.findOrCreate({
        where: { user_id: userId },
        defaults: {
          display_name: displayName,
          created_at: new Date(),
        },
      });

      console.log(`✅ Usuario creado: ${userId}`);
    }

    if (type === 'user.deleted') {
      await models.UserProfile.destroy({
        where: { user_id: userId },
      });

      console.log(`🗑️ Usuario eliminado: ${userId}`);
    }

    if (type === 'user.updated') {
      const displayName =
        data.username ||
        data.first_name ||
        data.email_addresses?.[0]?.email_address?.split('@')[0] ||
        'SinNombre';

      // Actualiza el display_name si el perfil existe
      const [updated] = await models.UserProfile.update(
        { display_name: displayName },
        { where: { user_id: userId } },
      );

      if (updated) {
        console.log(`✏️ Usuario actualizado: ${userId}`);
      } else {
        // Si no existe, crea el perfil (por si acaso)
        await models.UserProfile.create({
          user_id: userId,
          display_name: displayName,
          created_at: new Date(),
        });
        console.log(`➕ Usuario creado por actualización: ${userId}`);
      }
    }

    res.status(200).send('✅ Webhook procesado');
  } catch (err) {
    console.error('❌ Error verificando webhook:', err);
    console.error(process.env.CLERK_WEBHOOK_SIGNING_SECRET);
    res.status(400).send('❌ Webhook no verificado');
  }
});

module.exports = router;
