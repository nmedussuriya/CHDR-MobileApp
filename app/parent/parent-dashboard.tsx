import { logger } from '@/utils/logger';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";

const { width } = Dimensions.get('window');

export default function ParentDashboard() {
  const router = useRouter();
  // CHANGED: Now an array to hold multiple children
  const [children, setChildren] = useState<any[]>([]); 
  // NEW: Track selected child
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    fetchChildData();
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const fetchChildData = async () => {
    try {
      setLoading(true);
      
      const user = auth.currentUser;
      if (!user) {
        logger.log("No user logged in");
        router.replace("/");
        return;
      }

      const parentsQuery = query(
        collection(db, "parents"),
        where("user_id", "==", user.uid)
      );
      const parentSnapshot = await getDocs(parentsQuery);
      
      if (parentSnapshot.empty) {
        logger.log("No parent found for this user");
        setLoading(false);
        return;
      }

      const parentDoc = parentSnapshot.docs[0];
      const parentData = parentDoc.data();
      const parentId = parentDoc.id;
      setParentName(parentData.parent_name || "Parent");

      // CHANGED: Get ALL children for this parent
      const childrenQuery = query(
        collection(db, "children"),
        where("parent_id", "==", parentId)
      );
      const childrenSnapshot = await getDocs(childrenQuery);
      
      const childrenList = childrenSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setChildren(childrenList);
      
      // NEW: Auto-select first child if available
      if (childrenList.length > 0) {
        setSelectedChild(childrenList[0]);
      }

    } catch (error) {
      console.error("Error fetching child data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "Unknown";
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return `${years}y ${months}m`;
  };

  // NEW: Render child selector if multiple children
  const renderChildSelector = () => {
    if (children.length <= 1) return null;
    
    return (
      <View style={styles.childSelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={[
                styles.childChip,
                selectedChild?.id === child.id && styles.childChipSelected
              ]}
              onPress={() => setSelectedChild(child)}
            >
              <Text style={[
                styles.childChipText,
                selectedChild?.id === child.id && styles.childChipTextSelected
              ]}>
                {child.child_name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.replace("/");
      } catch (error) {
        console.error('Logout error:', error);
        Alert.alert('Error', 'Failed to logout');
      }
    };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your child's data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Like MidwifeDashboard */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>{greeting},</Text>
            <Text style={styles.parentName}>{parentName}!</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Ionicons name="log-out-outline" size={24} color="#fff" />
    </TouchableOpacity>

        </View>
        <Text style={styles.headerDate}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* NEW: Child selector appears here if multiple children */}
        {renderChildSelector()}

        {/* Child Profile Card - Uses selectedChild instead of child */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {selectedChild?.child_name?.charAt(0).toUpperCase() || 'B'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{selectedChild?.child_name || 'Baby'}</Text>
              <Text style={styles.profileDetail}>
                <Ionicons name="calendar-outline" size={12} /> {formatDate(selectedChild?.dob)}
              </Text>
            </View>
          </View>
          <View style={styles.ageBadge}>
            <Ionicons name="time-outline" size={14} color="#4CAF50" />
            <Text style={styles.ageBadgeText}>{calculateAge(selectedChild?.dob)}</Text>
          </View>
        </View>

        {/* Health Stats Grid - Uses selectedChild */}
        <Text style={styles.sectionTitle}>Health Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="fitness-outline" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{selectedChild?.birth_weight || 0} kg</Text>
            <Text style={styles.statLabel}>Birth Weight</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="resize-outline" size={24} color="#2196F3" />
            <Text style={styles.statValue}>{selectedChild?.length_at_birth || 0} cm</Text>
            <Text style={styles.statLabel}>Birth Length</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="analytics-outline" size={24} color="#FF9800" />
            <Text style={styles.statValue}>{selectedChild?.head_circumference || 0} cm</Text>
            <Text style={styles.statLabel}>Head Circ.</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="heart-outline" size={24} color="#9C27B0" />
            <Text style={styles.statValue}>Normal</Text>
            <Text style={styles.statLabel}>Health Status</Text>
          </View>
        </View>

        {/* Quick Actions - Pass childId to each screen */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push({
              pathname: "/parent/add_development_milestone",
              params: { childId: selectedChild?.id }
            } as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="happy-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Milestone</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push({
              pathname: "/parent/milestone_vision",
              params: { childId: selectedChild?.id }
            } as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#2196F3' }]}>
              <Ionicons name="eye-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Hearing/Vision</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push({
              pathname: "/parent/Immunization",
              params: { childId: selectedChild?.id }
            } as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FF9800' }]}>
              <Ionicons name="medical-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>Vaccines</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push({
              pathname: "/parent/AIChatScreen",
              params: { childId: selectedChild?.id }
            } as any)}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#9C27B0' }]}>
              <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.actionText}>AI Chatbot</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <View style={styles.activityTextContainer}>
              <Text style={styles.activityTitle}>Last Checkup</Text>
              <Text style={styles.activityDate}>2 weeks ago</Text>
            </View>
          </View>
          <View style={styles.activityDivider} />
          <View style={styles.activityItem}>
            <Ionicons name="warning" size={20} color="#FF9800" />
            <View style={styles.activityTextContainer}>
              <Text style={styles.activityTitle}>Next Vaccine</Text>
              <Text style={styles.activityDate}>Due in 5 days</Text>
            </View>
          </View>
        </View>
        

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("/parent/add_development_milestone" as any)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// NEW: Added styles for child selector
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  parentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: 5,
  },
  headerDate: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: -15,
  },
  // NEW: Child selector styles
  childSelectorContainer: {
    marginBottom: 15,
  },
  childChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  childChipSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  childChipText: {
    color: '#333',
  },
  childChipTextSelected: {
    color: '#fff',
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileDetail: {
    fontSize: 14,
    color: '#666',
  },
  ageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  ageBadgeText: {
    color: '#4CAF50',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logoutButton: {
  padding: 8,
  backgroundColor: 'rgba(255,255,255,0.2)',
  borderRadius: 20,
  },
  logoutButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 10,
    gap: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});