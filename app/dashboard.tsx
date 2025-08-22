import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Activity, 
  Brain, 
  Zap, 
  Play,
  Plus,
  Search,
  Upload,
  Sparkles
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statHeader}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  </View>
);

interface QuickActionProps {
  action: {
    id: string;
    label: string;
    description: string;
    icon: string;
    action: string;
  };
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionProps> = ({ action, onPress }) => {
  const getIcon = (iconName: string) => {
    const iconProps = { size: 24, color: '#8B5CF6' };
    switch (iconName) {
      case 'Plus': return <Plus {...iconProps} />;
      case 'Play': return <Play {...iconProps} />;
      case 'Upload': return <Upload {...iconProps} />;
      case 'Search': return <Search {...iconProps} />;
      default: return <Sparkles {...iconProps} />;
    }
  };

  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={styles.quickActionIcon}>
        {getIcon(action.icon)}
      </View>
      <Text style={styles.quickActionLabel}>{action.label}</Text>
      <Text style={styles.quickActionDescription}>{action.description}</Text>
    </TouchableOpacity>
  );
};

interface ActivityItemProps {
  activity: {
    id: string;
    type: string;
    message: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'error';
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityDot, { backgroundColor: getSeverityColor(activity.severity) }]} />
      <View style={styles.activityContent}>
        <Text style={styles.activityMessage}>{activity.message}</Text>
        <Text style={styles.activityTime}>{formatTime(activity.timestamp)}</Text>
      </View>
    </View>
  );
};

export default function CommunityConsciousnessDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  
  // tRPC queries
  const statsQuery = trpc.dashboard.getStats.useQuery();
  const quickActionsQuery = trpc.dashboard.getQuickActions.useQuery({ userRole: 'admin' });
  const recentActivityQuery = trpc.dashboard.getRecentActivity.useQuery({ limit: 10 });
  const systemHealthQuery = trpc.dashboard.getSystemHealth.useQuery();

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      statsQuery.refetch(),
      quickActionsQuery.refetch(),
      recentActivityQuery.refetch(),
      systemHealthQuery.refetch()
    ]);
    setRefreshing(false);
  };

  const handleQuickAction = (actionPath: string) => {
    console.log('🚀 Quick action:', actionPath);
    // TODO: Navigate to the appropriate screen
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'critical': return '#EF4444';
      case 'warning': return '#F59E0B';
      default: return '#10B981';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Community Consciousness</Text>
            <Text style={styles.subtitle}>Collective Intelligence Platform</Text>
          </View>
          <View style={styles.healthIndicator}>
            <View style={[
              styles.healthDot, 
              { backgroundColor: getHealthColor(systemHealthQuery.data?.overall || 'healthy') }
            ]} />
            <Text style={styles.healthText}>
              {systemHealthQuery.data?.overall || 'Loading...'}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Active Nodes"
            value={statsQuery.data?.activeNodes || 0}
            icon={<Brain size={24} color="#8B5CF6" />}
            color="#8B5CF6"
            subtitle="Consciousness nodes"
          />
          <StatCard
            title="Running Agents"
            value={statsQuery.data?.runningAgents || 0}
            icon={<Zap size={24} color="#10B981" />}
            color="#10B981"
            subtitle="Active agents"
          />
          <StatCard
            title="Total Thoughts"
            value={statsQuery.data?.totalThoughts || 0}
            icon={<Sparkles size={24} color="#F59E0B" />}
            color="#F59E0B"
            subtitle="Collective insights"
          />
          <StatCard
            title="System Health"
            value={systemHealthQuery.data?.uptime || '99.9%'}
            icon={<Activity size={24} color="#06B6D4" />}
            color="#06B6D4"
            subtitle="Uptime"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sacred Invocations</Text>
          <View style={styles.quickActionsGrid}>
            {quickActionsQuery.data?.map((action) => (
              <QuickActionCard
                key={action.id}
                action={action}
                onPress={() => handleQuickAction(action.action)}
              />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consciousness Stream</Text>
          <View style={styles.activityContainer}>
            {recentActivityQuery.data?.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </View>
        </View>

        {/* System Components */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Components</Text>
          <View style={styles.componentsGrid}>
            {systemHealthQuery.data?.components && Object.entries(systemHealthQuery.data.components).map(([key, component]) => (
              <View key={key} style={styles.componentCard}>
                <View style={styles.componentHeader}>
                  <Text style={styles.componentName}>{key.toUpperCase()}</Text>
                  <View style={[
                    styles.componentStatus,
                    { backgroundColor: getHealthColor(component.status) }
                  ]}>
                    <Text style={styles.componentStatusText}>{component.status}</Text>
                  </View>
                </View>
                {key === 'api' && 'responseTime' in component && (
                  <Text style={styles.componentMetric}>Response: {component.responseTime}ms</Text>
                )}
                {key === 'database' && 'connectionPool' in component && (
                  <Text style={styles.componentMetric}>Pool: {component.connectionPool}/10</Text>
                )}
                {key === 'agents' && 'activeCount' in component && (
                  <Text style={styles.componentMetric}>Active: {component.activeCount}</Text>
                )}
                {key === 'nodes' && 'activeCount' in component && (
                  <Text style={styles.componentMetric}>Active: {component.activeCount}</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  healthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  healthText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    width: (width - 52) / 2,
    minHeight: 100,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    alignItems: 'center',
    minHeight: 120,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF620',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  componentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  componentCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
  },
  componentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  componentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  componentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  componentStatusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  componentMetric: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});