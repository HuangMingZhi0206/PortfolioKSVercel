import { motion } from 'framer-motion'
import { Briefcase, FolderOpen, Award, MessageSquare, Code2, TrendingUp, RefreshCw } from 'lucide-react'

const DashboardHome = ({ stats, onRefresh }) => {
  const statCards = [
    { label: 'Projects', value: stats?.projects || 0, icon: FolderOpen, color: 'from-blue-500 to-cyan-500' },
    { label: 'Experiences', value: stats?.experiences || 0, icon: Briefcase, color: 'from-purple-500 to-pink-500' },
    { label: 'Certifications', value: stats?.certifications || 0, icon: Award, color: 'from-amber-500 to-orange-500' },
    { label: 'Skills', value: stats?.skills || 0, icon: Code2, color: 'from-green-500 to-emerald-500' },
    { label: 'Unread Messages', value: stats?.unreadMessages || 0, icon: MessageSquare, color: 'from-red-500 to-rose-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h2>
            <p className="text-indigo-100">
              Manage your portfolio content from this dashboard. Keep your profile updated!
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Project', icon: FolderOpen, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
            { label: 'Add Experience', icon: Briefcase, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
            { label: 'Add Certification', icon: Award, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
            { label: 'View Messages', icon: MessageSquare, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
          ].map((action) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border ${action.color} transition-all hover:opacity-80`}
            >
              <action.icon size={24} className="mb-2" />
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Tips</h3>
        <ul className="space-y-3 text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-indigo-400">•</span>
            Keep your profile photo and CV updated for better impression
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400">•</span>
            Add detailed descriptions to your projects with technologies used
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400">•</span>
            Respond to messages promptly to maintain good communication
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400">•</span>
            Regularly update your skills and certifications
          </li>
        </ul>
      </div>
    </div>
  )
}

export default DashboardHome
