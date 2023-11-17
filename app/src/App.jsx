import { useState } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = "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";


function App() {
const [typing, setTyping] = useState(false)
const [messages, setMessages] = useState([
    {
      message: "Hi, I'm Ibrahim! How can I help you?",
      sender: "Ibrahim"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message ,
      sender: "user",
      direction: 'outgoing',
   }

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    setTyping(true);

    await processMessageToChatGPT(newMessages);

  
  }

  async function processMessageToChatGPT(chatMessages) {

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "Ibrahim") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });


    const systemMessage = { 
      "role": "system", "content": "Explain things like you're talking to a college student."
    }



    
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  
        ...apiMessages 
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages, {
        message: data.choices[0].message.content,
        sender: "Ibrahim"
      }]);
      setIsTyping(false);
    });


}


  return (
    <div className="App">
      <div style={{ position: "relative", height: "700px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList
            typingIndicator={typing ? <TypingIndicator content="Ibrahim is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );

}

export default App
