import { Text, View, Image, Button } from "react-native";

export default function BadgerBakedGood(props) {

    return <View>
        <Image style={{ width: 250, height: 250 }} source={{ uri: props.image }} />
        <Text style={{ fontWeight: 'bold' }}>{props.name}</Text>
        <Text>${props.price}</Text>
        <Text>You can order upto {props.orderLimit} units!</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Button
                title="-"
                disabled={props.itemCount === 0}
                onPress={props.decreaseItemCount}
            />
            <Text>{props.itemCount}</Text>
            <Button
                title="+"
                disabled={props.orderLimit !== 'Unlimited' && props.itemCount === props.orderLimit}
                onPress={props.increaseItemCount}
            />
        </View>
    </View>
}
