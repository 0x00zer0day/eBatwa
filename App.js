
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Modal, TextInput, Button } from 'react-native';
const { ethers, JsonRpcProvider, parseEther, formatEther } = require("ethers")

import fetchGasFees from './src/gasStats'
// import {GasFeesComponent} from './src/gasStats'

const INFURA_API_KEY ="58287423e11f4152bceac5df13b2a28e"
const NETWORK = "polygon-amoy"
const ADDRESS = '0x14d27B0a0B9f01F9B5243DCA4dd93D4d3eef15C2'
const PRIVATE_KEY = '0xbc994385d80c6bd6fb617e76a8446d260f63a262a46d45498aec09d5dc405dce'

const provider = new JsonRpcProvider(`https://${NETWORK}.infura.io/v3/${INFURA_API_KEY}`)

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [gas, setGas] = useState(null);


  async function fetchWalletBalance(selfAddress) {
    try {
      const balance = await provider.getBalance(ADDRESS);
      const balanceInEther = formatEther(balance);
      // console.log(`Balance: ${balanceInEther} MATIC`);
      const formattedBalance = Number(balanceInEther).toFixed(3)
      return formattedBalance;
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      return null;
    }
  }

  // useEffect(() => {
  //   fetchWalletBalance(ADDRESS).then(setBalance);
  // }, [ADDRESS]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchWalletBalance(ADDRESS).then(setBalance);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchGasFees().then(setGas);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const Transaction = async (recipient, amount) => {
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)
    const amountToSend = parseEther(amount)

    const transactInfo = {
      to:recipient,
      value:amountToSend,
    }

    const gasLimit = await provider.estimateGas(transactInfo)

    const tx = await signer.sendTransaction({
      ...transactInfo,
      gasLimit,
    })

    console.log(`Transaction Hash: ${tx.hash}`)
    console.log("Waiting for Transaction to be mined...")

    const receipt = await tx.wait()
    console.log(`Transaction was mined in block ${receipt.blockNumber}`)
  }

  const handleSendPress = () => {
    setModalVisible(true);
  };

  const handleSend = () => {
    console.log('Sending to Address:', address);
    console.log('Amount:', amount);
    Transaction(address, amount)
      .catch((error) => {
        console.error(error)
      })
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
    <View style={styles.appName}>
    <Text style={styles.appNameText}>eBatwa</Text>
      </View>
      <View style={styles.balanceContainer}>
        <View style={styles.walletText}>
          <Text style={styles.headerText}>Wallet 1</Text>
        </View>
        <Text style={styles.balanceText}>{balance ? `${balance} MATIC` : `Loading...`}</Text>
      </View>
      <View style={styles.gasContainer}>
        <Text style={styles.gasText}>{gas ? `⛽ ${gas} Gwei` : `Loading...`}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight style={styles.button} onPress={handleSendPress}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={() => console.log('Receive pressed')}>
          <Text style={styles.buttonText}>Receive</Text>
        </TouchableHighlight>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Enter Address:</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
            />
            <Text style={styles.modalText}>Enter Amount:</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableHighlight style={styles.modalSendButton}>
              <Text style={styles.modalSendText} onPress={handleSend}>Send</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'#1D1E2C',
  },
  balanceContainer: {
    backgroundColor: '#333333',
    marginTop:-7,
    marginBottom: 20,
    padding: 10,
    height:'25%',
    borderRadius: 10,
    width:'94%',
    alignItems:'center',
    borderWidth:2,
    borderColor: '#545454',
  },
  balanceText: {
    fontSize: 50,
    fontWeight:'bold',
    color:'#fff',
    paddingTop:30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },

  button: {
    backgroundColor: '#31526E',
    padding: 10,
    borderRadius: 5,
    width: 200,
    height:50,
    alignItems: 'center',
    justifyContent:'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

  headerText: {
    fontSize:18,
    color:'#9B9B9B',
    fontWeight:'bold',
    padding:10,
    backgroundColor:'#202020',
    borderRadius:5,
    textAlign:'center',
  },

  walletText: {
    width: '100%',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#454545',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color:'#9F9F9F'
  },

  modalSendText: {
    backgroundColor: '#31526E',
    padding: 10,
    borderRadius: 5,
    width: 200,
    height:50,
    width:'100%',
    fontSize:18,
    textAlign:'center',
    color:'#fff'
  },

  modalSendButton: {
    justifyContent:'center',
    alignItems:'center',
  },

  modalText: {
    color: '#9F9F9F',
  },

  appName: {
    backgroundColor: '#161616',
    height:'7%',
    width:'94%',
    marginTop:50,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    // justifyContent:'center',
    alignItems:'center',
    borderWidth:2,
    borderColor:'#3D3D3D',
  },

  appNameText: {
    color:'#8E9CD5',
    fontSize:24,
    fontWeight:'900',
    paddingTop:12,
  },

  gasContainer: {
    backgroundColor: '#333333',
    padding: 10,
    height:'15%',
    borderRadius: 10,
    width:'94%',
    alignItems:'center',
    justifyContent: 'center',
    borderWidth:2,
    borderColor: '#545454',
  },

  gasText: {
    fontSize: 30,
    fontWeight:'bold',
    color:'#fff',
  }

});
