import { Text, View, Button, Alert } from "react-native";
import BadgerBakedGood from "./BadgerBakedGood";
import React, { useState, useEffect } from 'react';

export default function BadgerBakery() {
    const [bakedGoods, setBakedGoods] = useState([]);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [itemCounts, setItemCounts] = useState([]);

    useEffect(() => {
        fetch('https://cs571.org/api/f23/hw7/goods', {
            headers: {
                "X-CS571-ID": "bid_b17011e15e08e0a932b9fbe1084a58619b81e6dfd03fd7e2ac6bdd8ff6a75367"
            }
        })
            .then(res => res.json())
            .then(data => {
                const keys = Object.keys(data);
                const goodsArray = keys.map(key => {
                    const item = data[key];
                    return {
                        id: key,
                        name: item.name,
                        imgSrc: item.imgSrc,
                        price: item.price,
                        upperLimit: item.upperLimit === -1 ? 'Unlimited' : item.upperLimit
                    };
                });
                setBakedGoods(goodsArray);
                const zeroCount = {};
                keys.forEach(key => {
                    zeroCount[key] = 0;
                });
                setItemCounts(zeroCount);
            })
    }, []);

    const decreaseItemCount = () => {
        const count = itemCounts[bakedGoods[currentItemIndex].id];
        if (count > 0) {
            const updatedCounts = { ...itemCounts };
            updatedCounts[bakedGoods[currentItemIndex].id]--;
            setItemCounts(updatedCounts);
        }
    };

    const increaseItemCount = () => {
        const orderLimit = bakedGoods[currentItemIndex].upperLimit;
        const count = itemCounts[bakedGoods[currentItemIndex].id];
        if (orderLimit === 'Unlimited' || count < orderLimit) {
            const updatedCounts = { ...itemCounts };
            updatedCounts[bakedGoods[currentItemIndex].id]++;
            setItemCounts(updatedCounts);
        }
    };

    const previousItem = () => {
        if (currentItemIndex > 0) {
            setCurrentItemIndex(currentItemIndex - 1);
        }
    };

    const nextItem = () => {
        if (currentItemIndex < bakedGoods.length - 1) {
            setCurrentItemIndex(currentItemIndex + 1);
        }
    };

    const calculateTotal = () => {
        let totalCost = 0;
        bakedGoods.forEach(item => {
            totalCost += item.price * itemCounts[item.id];
        });
        return totalCost.toFixed(2);
    };

    const placeOrder = () => {
        const totalItemCount = Object.values(itemCounts).reduce((acc, count) => acc + count, 0);
        const totalPrice = calculateTotal();

        Alert.alert(
            "Order Confirmed!",
            `Your order contains ${totalItemCount} items and costs $${totalPrice}!`,
            [
                { text: "OK", onPress: () => resetOrderDetails() }
            ]
        );
    };

    const resetOrderDetails = () => {
        setCurrentItemIndex(0);
        const resetCounts = {};
        Object.keys(itemCounts).forEach(key => {
            resetCounts[key] = 0;
        });
        setItemCounts(resetCounts);
    };

    return <View style={{ alignItems: 'center' }}>
        <Text>Welcome to Badger Bakery!</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <Button
                title="Previous"
                disabled={currentItemIndex === 0}
                onPress={previousItem}
            />
            <Button
                title="Next"
                disabled={currentItemIndex === bakedGoods.length - 1}
                onPress={nextItem}
            />
        </View>
        {bakedGoods.length > 0 && (
            <BadgerBakedGood
                name={bakedGoods[currentItemIndex].name}
                image={bakedGoods[currentItemIndex].imgSrc}
                price={bakedGoods[currentItemIndex].price.toFixed(2)}
                orderLimit={bakedGoods[currentItemIndex].upperLimit}
                itemCount={itemCounts[bakedGoods[currentItemIndex].id]}
                increaseItemCount={increaseItemCount}
                decreaseItemCount={decreaseItemCount}
            />
        )}
        <Text>Total: ${calculateTotal()}</Text>
        <Button
            title="Place Order"
            disabled={calculateTotal() === "0.00"}
            onPress={placeOrder}
        />
    </View>
}
