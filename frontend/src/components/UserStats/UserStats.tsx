import React from 'react';
import { motion } from 'framer-motion';
import { generateUserStats } from '@/utils/userGenerator';

interface UserStatsProps {
  sessionId: string;
  sessionName: string;
  cornCount: number;
}

export const UserStats: React.FC<UserStatsProps> = ({
  sessionId,
  sessionName,
  cornCount
}) => {
  const stats = generateUserStats(cornCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200 rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">

          <div>
            <h3 className="font-bold text-green-800">{sessionName}</h3>
            <p className="text-xs text-gray-500 font-mono">{sessionId}</p>
            <p className="text-sm text-green-600">Nivel {stats.level}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-700">
            {stats.totalCorn}
          </div>
          <p className="text-xs text-green-500">Choclos comprados</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progreso al Nivel {stats.level + 1}</span>
          <span>{stats.nextLevelProgress}/{stats.nextLevelTarget}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(stats.nextLevelProgress / stats.nextLevelTarget) * 100}%` }}
            transition={{ delay: 0.5, duration: 1 }}
            className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};