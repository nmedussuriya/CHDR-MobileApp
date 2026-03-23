import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ScreeningQuestionCard({
  question,
  index,
  response,
  isSubmitted,
  isSubmitting,
  onAnswer,
  onSubmit,
}: any) {
  return (
    <View style={[
      styles.card,
      isSubmitted && styles.submitted
    ]}>
      <Text style={styles.number}>{index + 1}</Text>

      <Text style={[
        styles.text,
        isSubmitted && { color: "#27ae60" }
      ]}>
        {question.question_text}
      </Text>

      {isSubmitted ? (
        <Text style={styles.done}>
          ✓ Saved: {response}
        </Text>
      ) : (
        <>
          <View style={styles.row}>
            {["Yes", "No"].map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.btn,
                  response === val && styles.active
                ]}
                onPress={() => onAnswer(val)}
              >
                <Text style={response === val && { color: "#fff" }}>
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.submit}
            onPress={onSubmit}
          >
            <Text style={{ color: "#fff" }}>
              Submit
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  submitted: {
    backgroundColor: "#f0f8f0",
  },
  number: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: "center",
  },
  active: {
    backgroundColor: "#3498db",
  },
  submit: {
    backgroundColor: "#27ae60",
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  done: {
    color: "#27ae60",
    marginTop: 10,
  },
});