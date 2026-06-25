import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Alert, AppState, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';


const apiKey = '[Insert your API key here]'; // Replace with your actual API key
// Note: Make sure to keep your API key secure and not expose it in public repositories.


const styles = StyleSheet.create({
  view: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: '#15202b', // Dark mode background for full container
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#15202b', // Dark mode background for full container
    width: '100%',
  },
  scrollView: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 0,
    width: '100%',
  },

  conversationText: {
    marginBottom: 10,
    borderWidth: 0,
    padding: 5,
    color: '#f5f8fa',
    fontSize: 16,
  },

  submitButton: {
    backgroundColor: '#4f595e',
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  submitButtonText: {
    color: '#f5f8fa',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.5,
  },

  inputField: {
    padding: 10,
    backgroundColor: '#22303c',
    color: '#f5f8fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38444d',
    fontSize: 16,
    flex: 1,
  },

  inputRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },

  buttonWrapper: {
    marginLeft: 8,
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  buttonItem: {
    flex: 1,
    minWidth: 0,
  },
});

const InputWithButton = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [inputText, setInputText] = useState(''); // State variable for input text
  const [MyMessages, setMyMessages] = useState([]);
  const [conversation, setConversation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);
  const [jsonData, setJsonData] = useState({
    messages: MyMessages,
    response_config: null,
    model: 'glm-4.7',
    max_tokens: 4000,
    min_tokens: 50,
    temperature: 1,
    repetition_penalty: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    top_k: 0,
    epsilon_cutoff: 0,
    min_p: 0.01,
    top_p: 1,
    top_a: 0,
    typical_p: 1,
    eta_cutoff: 0,
    tfs: 1,
    mirostat_mode: 0,
    mirostat_tau: 0,
    mirostat_eta: 0,
    logit_bias: null,
    ignore_eos: false,
    stop: [],//stop: ["<|eot_id|>"],
    custom_token_bans: [],
    stream: false,
    timeout: null,
    allow_logging: null,
    logprobs: false,
    top_logprobs: null,
    reasoning: {"enabled": true}
  });

  // Refs and sizing for auto-growing input + scrolling behavior
  const scrollRef = useRef(null);
  const MIN_INPUT_HEIGHT = 40;
  const MAX_INPUT_HEIGHT = 140;
  
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appStateRef.current = nextAppState;
      setAppStateVisible(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);


    //useEffect(() => {

    //console.log(conversation)
    //console.log(MyMessages);
    useEffect(() => {


      const handleAPICall = async() => {


        //console.log('Full JSON prompt:', JSON.stringify(jsonData, null, 2));

        try {
          const userName = 'Enny';
          const aiName = 'AI Assistant';

          const preparedMessages = MyMessages.map(m => {
            if (typeof m.content !== 'string') return m;
            return {
              ...m,
              content: m.content
                .replace(/{{User}}/g, userName)
                .replace(/{{user}}/g, userName)
                .replace(/{{Char}}/g, aiName)
            };
          });

          const payload = { ...jsonData, messages: preparedMessages };

          const response = await axios.post('https://neuro.mancer.tech/oai/v1/chat/completions', payload, {
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          });

          const choiceContent = response.data.choices[0].message.content + "\n";

          //console.log('Full API response:', JSON.stringify(response.data, null, 2));

          //Update conversation with plain text:
          setConversation((conversation) => `${conversation}\n${choiceContent}`);

          //const formattedMessage = {role: "assistant", content: "<|im_start|>" + choiceContent + "<|im_end|>", name: "Chatbot"};
          const formattedMessage = {
            role: "assistant",
            content: choiceContent,
            name: "Chatbot",
          };


          if (messageCount > 100) {
            // Add formattedMessage to the end of MyMessages, then remove the message at index 1
            let updatedMyMessages = [...MyMessages, formattedMessage];
            // Remove the second message (index 1) to keep the list size manageable
            updatedMyMessages = [
              updatedMyMessages[0], ...updatedMyMessages.slice(updatedMyMessages.length - 49)
            ];

            const updatedJsonData = {
              ...jsonData,
              messages: updatedMyMessages,
            };
      
            
            setMyMessages(updatedMyMessages);
            setJsonData(updatedJsonData);

          }
          else {
            // If messageCount is 50 or less, just append the new message
            const updatedMyMessages = [...MyMessages, formattedMessage];
            const updatedJsonData = {
              ...jsonData,
              messages: updatedMyMessages,
            };

            setMyMessages(updatedMyMessages);
            setJsonData(updatedJsonData);

          }


          //const updatedJsonData = {
            //...jsonData,
            //messages: updatedMyMessages,
          //};

      
          //setMyMessages(updatedMyMessages);
          //setJsonData(updatedJsonData);
        }
        catch (error){
          console.error('API call error:', error);
        }
        finally {
          setIsLoading(false);
        }
      };

      if (messageCount > 0) {
        setIsLoading(true);
        handleAPICall().catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
      }

  }, [messageCount]);

  const buildConversationFromMessages = (messages) => {
    return messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => (typeof m.content === 'string' ? m.content : ''))
      .join('\n')
      .trim();
  };

  const hasAssistantMessage = MyMessages.some((m) => m.role === 'assistant');
  const hasConversation = conversation.trim().length > 0;
  const handleUndoLastAI = () => {
    const lastAssistantIndex = MyMessages.map((m) => m.role).lastIndexOf('assistant');
    if (lastAssistantIndex === -1) {
      Alert.alert('Nothing to undo', 'There is no AI message to remove.');
      return;
    }

    Alert.alert(
      'Confirm undo',
      'Remove the last AI message from the conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Undo',
          style: 'destructive',
          onPress: () => {
            const updatedMyMessages = MyMessages.filter((_, idx) => idx !== lastAssistantIndex);
            const updatedJsonData = {
              ...jsonData,
              messages: updatedMyMessages,
            };

            setMyMessages(updatedMyMessages);
            setJsonData(updatedJsonData);
            setConversation(buildConversationFromMessages(updatedMyMessages));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveConversation = async () => {
    const textToSave = conversation.trim();
    if (!textToSave) {
      Alert.alert('Nothing to save', 'The conversation is empty.');
      return;
    }

    try {
      await Share.share({
        title: 'Mancer Chat Export',
        message: textToSave,
      });
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Save failed', error.message || String(error));
    }
  };

  const handleButtonPress = () => {
    
    // Get the current input text

    const currentText = inputText + "\n";

    setConversation((conversation) => (`${conversation}\n${currentText}`));


    // Clear the input text
    setInputText('');


    //const formattedText = { role: "user", content: currentText, name: "me" }

    const formattedText = {
      role: "user",
      //content: "<|im_start|>" + currentText + "<|im_end|>",
      content: currentText,
      name: "me",
    };



    const updatedMyMessages = [...MyMessages, formattedText];
    const updatedJsonData = {
      ...jsonData,
      messages: updatedMyMessages,
    };

    
    setMyMessages(updatedMyMessages);
    setJsonData(updatedJsonData);
    
    setMessageCount((messageCount) => (messageCount + 1));



  };

  return (
    <SafeAreaView style={styles.view}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 60}
      >
        <ScrollView
          style={styles.scrollView}
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          <Text selectable={true} style={styles.conversationText}>{conversation}</Text>
        </ScrollView>

        <View style={{ width: '100%' }}>
          <View style={styles.buttonRow}>
            <Pressable
              title="Save"
              onPress={handleSaveConversation}
              style={[styles.submitButton, styles.buttonItem, { backgroundColor: hasConversation ? '#2a5d42' : '#3a3f42' }]}
              disabled={!hasConversation}
            >
              <Text style={styles.submitButtonText}>Save</Text>
            </Pressable>
            <Pressable
              title="Undo"
              onPress={handleUndoLastAI}
              style={[styles.submitButton, styles.buttonItem, { backgroundColor: hasAssistantMessage ? '#6b2f3b' : '#3a3f42' }]}
              disabled={!hasAssistantMessage}
            >
              <Text style={styles.submitButtonText}>Undo AI</Text>
            </Pressable>
            <Pressable
              title="Submit"
              onPress={handleButtonPress}
              style={[styles.submitButton, styles.buttonItem]}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>{isLoading ? 'Working...' : 'Submit'}</Text>
            </Pressable>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Enter text here"
              placeholderTextColor="#8899a6"
              multiline={true}
              onContentSizeChange={(e) => {
                const h = e.nativeEvent.contentSize.height;
                const newH = Math.max(MIN_INPUT_HEIGHT, Math.min(MAX_INPUT_HEIGHT, h));
                setInputHeight(newH);
              }}
              style={[styles.inputField, { height: Math.max(MIN_INPUT_HEIGHT, inputHeight) }]}
              scrollEnabled={inputHeight >= MAX_INPUT_HEIGHT}
              textAlignVertical='top'
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



export default InputWithButton;
