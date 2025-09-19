// Node modules
import mongoose from 'mongoose';

// Custom modules
import config from '@/config';
import User from '@/models/user';
import { logger } from '@/lib/winston';

async function fixUserSchema() {
  try {
    await mongoose.connect(config.MONGO_CONNECTION_URI);
    logger.info('Connected to MongoDB');

    const users = await User.find({});
    logger.info(`Found ${users.length} users to update`);

    for (const user of users) {
      // Move fields out of role object if they are nested
      if (typeof user.role === 'object') {
        const roleObj = user.role as any;

        // Update the document with correct structure
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              role: roleObj.type || 'user',
              totalVisitCount: roleObj.totalVisitCount || 0,
              passwordResetToken: roleObj.passwordResetToken || null,
              refreshToken: roleObj.refreshToken || null,
            },
          },
        );

        logger.info(`Updated user ${user._id}`);
      }
    }

    logger.info('Migration completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the migration
fixUserSchema();

//Run the script
//npx ts-node -r tsconfig-paths/register src/scripts/fixUserSchema.ts
