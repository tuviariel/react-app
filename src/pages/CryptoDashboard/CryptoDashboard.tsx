import { useCallback, useEffect, useState } from "react";
import Dialog from "../../components/Dialog";
import ListItem from "../../components/ListItem";
import CryptoDetail from "../CryptoDetail";
import { getCryptosList } from "../../services/service";
import { useCrypto } from "../../contexts/context";
import { ListObject } from "../../contexts/context";

export const CryptoDashboard = () => {
    const { modalCurrencyObject, setModalCurrencyObject } = useCrypto();
    const [coinList, setCoinList] = useState<ListObject[]>([]);
    const [watchedList, setWatchedList] = useState<ListObject[]>([]);
    useEffect(() => {
        const getList = async () => {
            try {
                let queryParams = { vs_currency: "usd" };
                const res: any = await getCryptosList(queryParams);
                if (!res.data) {
                    throw new Error(`Response status: ${res.status}`);
                }
                setCoinList(res.data);
                // console.log(res);
            } catch (err: any) {
                console.error(err.message);
            }
        };
        getList();
    }, []);

    const openDetail = useCallback((index: number) => {
        setModalCurrencyObject(coinList[index]);
        // console.log(index);
    }, []);
    const addToWatchList = (index: number) => {
        console.log(index);
        const object = coinList[index];
        setWatchedList((prev) => {
            return [...prev, object];
        });

        setCoinList((prev) => {
            let arr = prev.filter((item) => {
                return item.id !== object.id;
            });
            return arr;
        });
    };
    const removeFromWatchList = (index: number) => {
        console.log(index);
        const object = watchedList[index];
        setCoinList((prev) => {
            return [object, ...prev];
        });

        setWatchedList((prev) => {
            let arr = prev.filter((item) => {
                return item.id !== object.id;
            });
            return arr;
        });
    };
    // console.log(modalCurrencyObject);
    return (
        <>
            <h2 className="font-semibold text-3xl mb-12 underline">CryptoCurrencies from Gecko</h2>
            {watchedList.length > 0 && (
                <>
                    <div className="">Watched List</div>
                    <ol>
                        {watchedList.map((item, index) => {
                            return (
                                <ListItem
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    openDetail={openDetail}
                                    removeFromWatchList={removeFromWatchList}
                                    watchedList={true}
                                />
                            );
                        })}
                    </ol>
                </>
            )}
            {coinList.length > 0 && (
                <>
                    {watchedList.length > 0 && <div className="">Un-Watched List</div>}
                    <ol>
                        {coinList.map((item, index) => {
                            return (
                                <ListItem
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    openDetail={openDetail}
                                    addToWatchList={addToWatchList}
                                />
                            );
                        })}
                    </ol>
                </>
            )}
            <Dialog
                open={modalCurrencyObject?.id ? true : false}
                setOpen={setModalCurrencyObject}
                size="large"
                data="cryptoDetail"
                disableOverlayClose={true}>
                <CryptoDetail />
            </Dialog>
        </>
    );
};
