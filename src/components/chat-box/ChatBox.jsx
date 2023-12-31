import {useEffect, useState} from 'react'
import Message from '../message/Message'
import Input from '../input/Input'
import Button from '../button/Button'
import './chat-box.scss'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMessages, postMessage } from '../../store/chats/chatsActions'
import { io } from 'socket.io-client'
import ChatBoxNavbar from './ChatBoxNavbar'

const socket = io("https://message-api-1bt8.onrender.com")

const ChatBox = () => {
    const { userToken, userInfo } = useSelector(state => state.auth)
    const { loading, messages,chats } = useSelector(state => state.chats)
    const [message, setMessage] = useState('')
    const { chatId } = useParams()
    const dispatch = useDispatch()
    const [chat, setChat] = useState(null)
    useEffect(() => {
        if (chatId) {
            setChat(chats.find(chat => chat._id === chatId))
            dispatch(getMessages({chatId, token: userToken}))
        }
    }, [chatId])

    useEffect(() => {
        socket.on("user-chat", (data) => {
            if (data.chatId === chatId) {
                dispatch(getMessages({chatId, token: userToken}))
            }
        })
    }, [])
    
    const handleSendMessage = () => {
        if (message) {
            socket.emit("on-chat", {
                userInfo,
                chatId,
                message
            });
            dispatch(postMessage({chatId, senderId: userInfo.id, content: message,token: userToken}))
        };
        setMessage('');
    }

    return (
        chatId 
        ?
        <div className="chats__chatbox">
                <ChatBoxNavbar chat={chat}/>
                {false 
                ? <div style={{textAlign: 'center', width: '80%'}}> <p>Loading...</p></div>
                : <div className="chats__chatbox__content">
                    {messages.map((message) => {
                        return (
                            <Message
                                key={message._id}
                                className={message.sender === userInfo.id ? 'me' : ''}
                                id={message._id}
                                content={message.content}
                            />
                        )
                    })}
                </div>}
                <div className="chats__chatbox__sending">
                    <div className="chats__chatbox__sending__input">
                        <Input
                            type="text"
                            placeholder="Message..."
                            value={message}
                            onChange={(e)=>setMessage(e.target.value)}
                        />
                    </div>
                    <div className="chats__chatbox__sending__btn">
                        {false
                        ?   <Button
                                className="btn__sending"
                            >
                                <p>Sending...</p>
                            </Button>
                        :
                            <Button
                                className="btn__sending"
                                onClick={handleSendMessage}
                            >
                                <p>Send</p>
                            </Button>
                        }
                    </div>
                </div>
        </div>
        :<div style={{textAlign: 'center', width: '80%'}}> <p>Choose a chatbox</p></div>
    )
}

export default ChatBox