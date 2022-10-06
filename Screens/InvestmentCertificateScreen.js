//import liraries
import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Image, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore/lite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import emailjs from '@emailjs/browser';
import { RadioButton ,Switch } from 'react-native-paper';

import { useState } from "react";

// create a component
const InvestmentCertificateScreen = ({ navigation }) => {

    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hour = new Date().getHours();
    let minute = new Date().getMinutes();
    let second = new Date().getSeconds();
    let transactionName = "Inv. Certificate";



    const [accNumber, setaccNumber] = useState("");
    const [value, setValue] = React.useState("10");
    const [Name, setName] = useState("");


    const [Bal, setBAl] = useState("");

    const [AdminEmail, setAdminEmail] = useState("");

    const [Email, setEmail] = useState("");

    const [AdminID, setAdminID] = useState("");
  
    let bondNum = (Math.floor(Math.random() * 100000) + 1).toString();


    const userRef1 = collection(db, "Admin");
    const q1 = query(userRef1, where("name", "==", "Admin"));
    getDocs(q1).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            setAdminEmail(doc.get('email'))
            setAdminID(doc.id);
        });
    }).catch(() => console("Invaliiiiid"))




    let ID = auth.currentUser?.uid;
    const docRef = doc(db, "Users", ID.toString());
    getDoc(docRef).then((doc) => {
        setaccNumber(doc.get('accountNumber'));
        setName(doc.get('name'));
        setEmail(doc.get('email'));
    }).catch(() => console("NO doc"))



    let templateParams = {
        nameform: Name,
        amountform: value,
        accNumform: accNumber,
        bondform: bondNum,
        emailform : AdminEmail,
    };

    const sendEmail = (e) => {
        e.preventDefault();
        

        
            Alert.alert('Successful operation ', 'your request has been sent to Admin', [
                { text: 'done' }
            ]);



            emailjs.send('service_e0r85af', 'template_0tqz7va', templateParams, 'd1xTb_weRsbxDVl2x')
                .then((result) => {
                    console.log("Successful ", result.text);
                }, (error) => {
                    console.log("Failed ", error.text);
                });
                addDoc(collection(db, `Transaction/${AdminID}/Details`), {
                    Date: date + "/" + month + "/ " + year,
                    Clock: hour + ":" + minute + ": " + second,
                    TransactionName: transactionName,
                    To: "Admin",
                    Amount: value,
                    From: Email,
                    bondNumber: bondNum,
                    FromAccountNumber: accNumber,
                    Name: Name,
                });


     //   console.log("name = ", templateParams.nameform, 'mess : ', templateParams.messageform, " recname = ", templateParams.reciverNameform, "recEmail = ", templateParams.reciverEmailform);
    //    console.log(" recname = ", reciverName, "recaccN = ", reciverAccountNumber);

    }



    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor='rgba(0,0,0,0)' />



            <View style={styles.inputview3}>
                <Text style={styles.txt}>Accounbt name : </Text>
                <Text
                    style={{
                        fontSize: 28, fontStyle: 'italic', color: 'rgb(0,0,0)', fontWeight: 'normal',
                        fontFamily: 'serif', marginLeft: 20, marginTop: 5,
                    }}>{Name} </Text>
            </View>
            <Text style={{ fontSize: 25, color: '#F0A500',marginLeft : 35,marginTop : 40, }}>  Choose an amount :</Text>

            <View style={styles.inputview4}>

                <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value} >
                    
                    <View style={{flexDirection: 'row-reverse', alignItems: "center" , }}>
                        <Text style={{fontSize: 18, paddingLeft :10,color : '#E45826'}}>50000 $</Text>
                        <RadioButton value="50000" 
                        color="#1B1A17"/>
                    </View>
     
                    <View style={{flexDirection: 'row-reverse', alignItems: "center" , }}>
                        <Text style={{fontSize: 18,color : '#E45826' }}>100000 $</Text>
                        <RadioButton value="100000" 
                        color="#1B1A17"/>
                    </View>

                    

                </RadioButton.Group>
            </View>




            <TouchableOpacity
                style={styles.btn}
                onPress={sendEmail} >
                <Text style={styles.btnText} > Request a certificate </Text>
                <Ionicons name={'send-outline'} size={20} color={'white'} />
            </TouchableOpacity></View>



    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0)",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginTop: 60,
    },
    inputview1: {
        backgroundColor: 'rgba(0,0,0,0)',
        marginHorizontal: '10%',
        marginBottom: 10,
        marginTop: 30,
        height: 60,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3,
        borderColor: 'black',
    },

    inputview2: {
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0)',
        height: 150,
        marginLeft: 30,
        width: '85%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderRadius: 40,
        borderWidth: 3,
        borderColor: 'black',
    },

    inputview3: {

        backgroundColor: 'rgba(0,0,0,0)',
        marginHorizontal: 20,
        marginTop: 50,
        marginBottom : 50,
        height: 50,
        width: '90%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

    },
    inputview4: {
        backgroundColor: 'rgba(0,0,0,0)',
        marginHorizontal: 100,
        marginTop: 20,
        paddingBottom: 19,
        height: 65,
        width: '90%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 100,
   
    },

    textinput: {
        fontFamily: 'sans-serif',
        fontStyle: 'italic',
        borderColor: "black",
        marginTop: 10,
        marginLeft: 20,
        borderRadius: 10,
        textAlign: "center",
        color: "black",
        fontSize: 16,
    },

    textinput1: {
        fontFamily: 'sans-serif',
        fontStyle: 'italic',
        borderColor: "black",
        marginTop: 10,
        marginLeft: 8,
        borderRadius: 10,
        textAlign: "center",
        color: "black",
        fontSize: 16,
    },

    btnText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'sans-serif',
        textAlign: 'center',
        marginHorizontal: 8,
    },
    btn: {
        paddingTop: 18,
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 90,
        backgroundColor: '#1B1A17',
        height: 58,
        width: '60%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderRadius: 20,
    },
    Imagebackgrounds: {
        marginTop: 5,
        marginHorizontal: '35%',
        height: 175,
        width: 175,
    },

    balance_part: {
        flexDirection: 'row',
        marginTop: 30,
        width: '80%',
        height: 60,
        backgroundColor: 'rgba(0,0,0,0.15)',
        marginHorizontal: '10%',
        borderRadius: 10,

    },

    txt: {
        fontSize: 20,
        fontStyle: 'italic',
        color: '#F0A500',
        fontWeight: 'normal',
        fontFamily: 'serif',
        marginLeft: 10,
        marginTop: 15,
        marginBottom: 7,
    },

});

//make this component available to the app
export default InvestmentCertificateScreen;
