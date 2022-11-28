import React, {Component} from 'react';
import {motion} from 'framer-motion';
import * as J from 'ja-ui-next';
import {default as Toggle} from '../Motion/toggle';
import './styles/nav.css'
import "../../index.css";
import {Button, Text, Tooltip} from "@nextui-org/react";
import {Link as RLink} from 'react-router-dom';
import styled from 'styled-components';


const lRef = React.forwardRef((props, ref)=>{
   return (
      <RLink {...props} ref={ref}/>
   )
}), Link = motion(lRef);
const Box = motion('div');
const bRef = React.forwardRef((props, ref)=>{
   return (<Button {...props} ref={ref}/>);
})
const LButton = motion(bRef);
const Btn = styled(Link)`
   border-radius: 15px;
   padding: 5px;
   //background: hsla(15, 100%, 50%, 0.3);
   border-style: none;
   margin: 10px;
   justify-content: center;
   align-items: center;
   height: auto;
   width: 80px;
   text-decoration: none;
   color: #fff9f9;
`
export class Navbar extends Component {
   constructor(props) {
      super(props);
      this.state={
         sidebar:false,
         open:false,
         login:'',
         register: window.location.pathname === '/register',
         activePage:window.location.pathname.split('/')[1] === ""?"home":window.location.pathname.split('/')[1].toLowerCase()
      }
   }
   
   componentDidMount() {
   
   
   }
   shouldComponentUpdate(nextProps, nextState) {
      return this.props!==nextProps || this.state!==nextState;
   }
   
   componentDidUpdate(prevProps, prevState) {
      // console.log(this.state);
   }
   
   componentWillUnmount() {
   
   }
   ToolbarMenu=()=>(
      <Box
         style={{position: 'absolute' ,height: 65, width:''}}
         id={"toolbar-menu"}>
         
         {this.props.items.map((item, index) => {
            return (
               <Box
                  style={{zIndex: 1000, height: 65, display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", marginInline: 25, padding: 5}}
                  key={index + item}>
                  {this.state.activePage === this.props.items[index].toLowerCase() &&
                        <Box
                           style={{zIndex: 999, width: 100/this.props.items.length+"%",marginInline: 3, background: "hsla(15,100%,50%,0.8)", borderRadius: 20, height: 5, position: 'absolute',
                              // top: 'calc(50% - 25%)'
                              bottom: 0,
                        }}
                           layoutId={"selected"}/>
                  }
                  <Link
                     onClick={() => {
                        this.setState({
                           ...this.state,
                           activePage: this.props.items[index].toLowerCase(),
                           login: ''
                           // open: false
                        })
                     }}
                     style={{textDecoration: 'none', color: "white", width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center',zIndex: 1000}}
                     key={"link" + index}
                     whileHover={{scale: 1.1}}
                     to={this.props.items[index] === "Home" ? '/' : `/${this.props.items[index].toLowerCase()}`}>
                     <Text
                        style={{fontWeight: this.state.activePage === this.props.items[index].toLowerCase() ? 'bold' : 'normal'}}
                        key={item}>{item}</Text>
                  </Link>
               </Box>
            )
         })}
         {this.state.activePage=== "" && (
            <Box
               key={"layout3"}
               layoutId={'selected2'}
               style={{width: this.props.items.length*100, height: 5, top: 19, position: 'absolute', background: "hslaa(15, 100%, 50%, 1)", zIndex: 3010, display: 'flex'}}/>
         )}
      </Box>
   )
   Sidebar = (props) => {
      const containerVariants= {
         open: {x:0},
         closed:{
            x: -250
         }
      }
      const itemVariants={
         open: {},
         closed:{}
      }
      return(
         <div style={{zIndex: 3005}}>
            <Box id={"Sidebar-overlay"}
                 className={"background-blur"}
                 transition={{type: 'spring', bounce: 0, duration: 0.2}}
                 onTap={()=>{this.setState({...this.state,open: false})}}
                 animate={{x: this.state.open?0:"-100vw"}}
                 initial={{}}
                 style={{width:"100vw", height: "100vh", position: 'fixed', right: 0, top: 0,zIndex: 3006}}/>
            <Box
               id={"Sidebar"}
               className={"background-blur"}
               transition={{type: 'spring', bounce: 0.2, duration: 0.4}}
               style={{zIndex: 3007, overflow: "hidden",position: 'absolute', height: '100vh', width: 250, top: 0, left: 0, background: this.props.menuBg}}
               animate={this.state.open?"open":"closed"}
               initial={"closed"}
               variants={containerVariants}>
               <Box style={{width : "100%", height: this.props.items.length*65, position: 'absolute', top: 65, zIndex:3006}}>
                  {this.props.items.map((item, index) => {
                     return (
                        <Box
                           className={"background-blur"}
                           variants={itemVariants}
                           initial={'closed'}
                           animate={this.state.open?"open":"closed"}
                           style={{height: 65, display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%",zIndex: 3007}}
                           key={index + item}>
                           <Link
                              onClick={() => {
                                 this.setState({
                                    ...this.state,
                                    activePage: this.props.items[index].toLowerCase(),
                                    open: false
                                 })
                              }}
                              style={{textDecoration: 'none', color: "white", width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                              key={"link" + index}
                              whileHover={{scale: 1.1}}
                              to={this.props.items[index] === "Home" ? '/' : `/${this.props.items[index].toLowerCase()}`}>
                              <Text
                                 style={{fontWeight: this.state.activePage === this.props.items[index].toLowerCase() ? 'bolder' : 'lighter'}}
                                 key={item}>{item}</Text>
                           </Link>
                        </Box>
                     )
                  })}
               </Box>
               <Box style={{width: "100%",display: 'flex', justifyContent: 'center', alignItems: "center", position: 'absolute', bottom: 0, padding: 10}}>
                  <Btn onClick={props.onLoginClick} to={"/login"}>Sign In</Btn>
                  <Btn onClick={props.onLoginClick} to={"/register"}>Sign Up</Btn>
               </Box>
            </Box>
         </div>
      )
   }
   render() {
      let items = [{
         text: "Login",
         
      },{
         text: "Sign Up"
      }]
      let navbarVariants={
         open:{
            transition:{
               duration: 0.5
            }
         },
         closed: {}
      }
      let menuVariants={
         open:{
            x:0,
            width: 250,
            height: "100vh",
            transition:{
               type:'spring', bounce: 0.2,
               duration: 0.4
            }
         },
         closed:{
         }
      }
      let menuListVariants={
         open:{
            x:0,
            transition:{
               type:'spring', bounce: 0.2,
               duration: 0.4,
               staggerChildren: 0.09
            }
            
         },
         closed:{
            x:-250
         }
      }
      let listItemVariants={
         open:{
            x:0,
            transition:{
               type:'spring',
               duration: 0.3, bounce: 0.1
            }
         },
         closed:{
            x:0
         }
      }
      return (
         <Box
            className={"background-blur"}
            variants={navbarVariants}
            initial={'closed'}
            animate={this.state.open?"open":"closed"}
            style={{
               zIndex: 3388,
               display: 'flex',
               position: 'fixed',
               width: "100vw",
               height: 65,
               top: 0,
               left: 0,
               background: this.props.background || 'black'
            }}>
            {/*toolbar*/}
            <Box
               className={"background-blur"}
               style={{position: 'absolute',zIndex:3005, top: 0, display: 'flex', alignItems: 'center', width: "100%", height: 65, justifyContent: 'right'}}
               id={"toolbar"}>
               <this.Sidebar onLoginClick={()=>{this.setState({...this.state, open: false})}}/>
               <motion.button
                  id={"navbar-toggle"}
                  transition={{type: "spring", bounce: 0.1, duration: 0.4}}
                  animate={{x: this.state.open?195:0}}
                  whileHover={{scale:1.1}}
                  whileTap={{scale:0.8}}
                  style={{cursor: 'pointer', zIndex: 3400,background:'none', border: 'none',padding: 0, position: 'absolute', left: 15, top: "calc(50% - 12.5px)", height:25, width: 25}}
                  onTap={()=>this.setState({...this.state,open:!this.state.open})}>
                  {/*// onClick={()=>this.setState({...this.state,open:!this.state.open})}>*/}
                  <Toggle open={this.state.open}/>
               </motion.button>
               <this.ToolbarMenu/>
               <div
                     id={"nav-name"}
                     style={{zIndex: 3000, marginInline: 20, position: 'absolute', left: 0, height: 65, display: 'flex', justifyContent: "center", alignItems: 'center'}}>
                  <Text
                     size={20}
                     css={{margin: 0,padding: 0, textGradient: "45deg, $yellow600 -20%, $red600 100%"}} h5>Jeremy Anderson</Text>
               </div>
            </Box>
            <Box style={{position: 'absolute', height: "100%", display:'flex', alignItems: 'center', justifyContent: 'center', right: 0, padding: 10}}>
               {this.props.children}
            </Box>
            <Box style={{width: "auto",display: 'flex', justifyContent: 'center', alignItems: "center", position: 'absolute', bottom: 0, height: "100%",padding: 10, right: 0, zIndex: 3009}} id={"toolbar-btn-group"}>
               {items.map((item, index) => {
                  return (
                     <Box
                        key={item.text+'-container'}
                        style={{display: 'flex', justifyContent:"space-between", alignItems: 'center'}}>
                        {(this.state.login===item.text) && (
                           <Box
                              key={"layout"+index}
                              layoutId={"login-btns"}
                              style={{
                                 position: 'absolute',
                                 display: 'flex', justifyContent: 'center', alignItems: 'center',
                                 width: 110,
                                 height: 5,
                                 bottom: 0,
                                 margin: 0,
                                 padding: 0,
                                 background: "hsla(15, 100%, 40%, 0.9)",
                                 borderRadius:20,
                              }}/>
                        )}
                        <Btn key={index+item.text}
                             style={{zIndex:2000, width: 110, margin: 0, padding: 0,}}
                             onClick={() => {
                                this.setState({
                                   ...this.state,
                                   login:item.text,
                                   activePage:""
                                })
                             }}
                             to={item.text === "Login" ? "/login" : "/register"}>
                           <Text
                              key={item.text + index}
                              style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                              {item.text}
                           </Text>
                        </Btn>
                     </Box>)
                  })
               }
               {(this.state.login==="") && (
                  <Box
                     key={"layout2"}
                     layoutId={"login-btns"}
                     style={{
                        position: 'absolute',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        width: 220,
                        height: 5,
                        top: 0,
                        margin: 0,
                        padding: 0,
                        background: "hsla(15, 100%, 40%, 0.9)",
                        borderRadius:20,
                     }}/>
               )}
            </Box>
         </Box>
      );
   }
}