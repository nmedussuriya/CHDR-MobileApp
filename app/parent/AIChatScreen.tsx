import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import ChatHeader from "../../components/ChatHeader";
import ChatInputBar from "../../components/ChatInputBar";
import ChatMessageItem from "../../components/ChatMessageItem";
import { auth, db } from "../../firebase/firebaseConfig";
import { clearSessionHistory, getAIResponse } from "../../firebase/services/realAIService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isTyping?: boolean;
}

interface Child {
  child_id: string;
  child_name: string;
  dob: string;
  gender: string;
}

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "👋 Hi! I'm Dr. Riley, your child health assistant. I can help with:\n\n• 🏥 Child health concerns\n• 💉 Vaccination schedules\n• 🌱 Development milestones\n• 🍎 Nutrition & feeding\n• 😴 Sleep & behavior\n\nWhat would you like to know about your little one?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [childAge, setChildAge] = useState<number | null>(null);
  const [childName, setChildName] = useState<string>("");
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [isLoadingAge, setIsLoadingAge] = useState(true);

  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Calculate age from DOB in months
  const calculateAgeInMonths = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months += today.getMonth() - birthDate.getMonth();
    return months;
  };

  // Format age for display
  const formatAgeDisplay = (months: number): string => {
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  };

  // Fetch child data from Firebase
  useEffect(() => {
    fetchChildrenData();
  }, []);

  const fetchChildrenData = async () => {
    try {
      setIsLoadingAge(true);
      const user = auth.currentUser;
      if (!user) {
        console.log("No user logged in");
        return;
      }

      // Get parent record
      const parentsQuery = query(
        collection(db, "parents"),
        where("user_id", "==", user.uid)
      );
      const parentSnapshot = await getDocs(parentsQuery);
      
      if (parentSnapshot.empty) {
        console.log("No parent found");
        return;
      }
      
      const parentId = parentSnapshot.docs[0].id;

      // Get all children for this parent
      const childrenQuery = query(
        collection(db, "children"),
        where("parent_id", "==", parentId)
      );
      const childrenSnapshot = await getDocs(childrenQuery);
      
      const childrenList: Child[] = [];
      childrenSnapshot.forEach(doc => {
        childrenList.push({
          child_id: doc.id,
          ...doc.data()
        } as Child);
      });
      
      setChildren(childrenList);
      
      if (childrenList.length > 0) {
        // Select first child by default
        const firstChild = childrenList[0];
        setSelectedChildId(firstChild.child_id);
        setChildName(firstChild.child_name);
        const ageInMonths = calculateAgeInMonths(firstChild.dob);
        setChildAge(ageInMonths);
        
        // Optional: Add a system message about the child's age
        if (ageInMonths >= 0 && ageInMonths <= 60) { // 0-5 years
          console.log(`Child: ${firstChild.child_name}, Age: ${formatAgeDisplay(ageInMonths)}`);
        }
      }
      
    } catch (error) {
      console.error("Error fetching child data:", error);
    } finally {
      setIsLoadingAge(false);
    }
  };

  // Handle child selection (if multiple children)
  const handleChildSelect = (child: Child) => {
    setSelectedChildId(child.child_id);
    setChildName(child.child_name);
    const ageInMonths = calculateAgeInMonths(child.dob);
    setChildAge(ageInMonths);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    const typingId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: typingId,
        text: "...",
        sender: "ai",
        timestamp: new Date(),
        isTyping: true,
      },
    ]);

    try {
      // Pass the REAL child age to AI
      const response = await getAIResponse(userMessage.text, childAge || undefined);

      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== typingId);
        return [
          ...filtered,
          {
            id: (Date.now() + 2).toString(),
            text: response.message,
            sender: "ai",
            timestamp: new Date(),
          },
        ];
      });
    } catch (error) {
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== typingId);
        return [
          ...filtered,
          {
            id: (Date.now() + 2).toString(),
            text: "I'm having trouble connecting. Please check your internet and try again.",
            sender: "ai",
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        text: "👋 Hi! I'm Dr. Riley, your child health assistant. I can help with:\n\n• 🏥 Child health concerns\n• 💉 Vaccination schedules\n• 🌱 Development milestones\n• 🍎 Nutrition & feeding\n• 😴 Sleep & behavior\n\nWhat would you like to know about your little one?",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
    clearSessionHistory();
  };

  if (isLoadingAge) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your child's info...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader
        onBack={() => router.back()}
        onClear={clearChat}
      />

      {/* Child Age Indicator */}
      {childAge !== null && childAge <= 60 && (
        <View style={styles.ageIndicator}>
          <Text style={styles.ageText}>
            👶 {childName || "Your child"} is {formatAgeDisplay(childAge)} old
          </Text>
        </View>
      )}

      {/* Multiple Children Selector */}
      {children.length > 1 && (
        <View style={styles.childSelector}>
          <Text style={styles.childSelectorLabel}>Select child:</Text>
          <View style={styles.childChips}>
            {children.map((child) => (
              <TouchableOpacity
                key={child.child_id}
                style={[
                  styles.childChip,
                  selectedChildId === child.child_id && styles.childChipActive
                ]}
                onPress={() => handleChildSelect(child)}
              >
                <Text style={[
                  styles.childChipText,
                  selectedChildId === child.child_id && styles.childChipTextActive
                ]}>
                  {child.child_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animated.View style={[styles.messagesContainer, { opacity: fadeAnim }]}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
              <ChatMessageItem item={item} formatTime={formatTime} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        </Animated.View>
      </TouchableWithoutFeedback>

      <ChatInputBar
        inputText={inputText}
        setInputText={setInputText}
        loading={loading}
        onSend={sendMessage}
        inputRef={inputRef}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#4CAF50",
    fontSize: 16,
  },
  ageIndicator: {
    backgroundColor: "#E8F5E9",
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 20,
    alignItems: "center",
  },
  ageText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "500",
  },
  childSelector: {
    backgroundColor: "#fff",
    padding: 12,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  childSelectorLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  childChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  childChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  childChipActive: {
    backgroundColor: "#4CAF50",
  },
  childChipText: {
    fontSize: 14,
    color: "#333",
  },
  childChipTextActive: {
    color: "#fff",
  },
});