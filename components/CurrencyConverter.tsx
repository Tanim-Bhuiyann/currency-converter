"use client";

import { createContext, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AppContext = createContext({
  exchangeRatesCache: null as Record<string, number> | null,
  setExchangeRatesCache: (value: Record<string, number> | null) => {},
  currencies: ["USD", "EUR", "GBP", "BDT"],
});

const BaseCurrencyContext = createContext({
  baseCurrency: "",
  setBaseCurrency: (value: string) => {},
});

const TargetCurrencyContext = createContext({
  targetCurrency: "",
  setTargetCurrency: (value: string) => {},
});

const AmountContext = createContext({
  amount: "",
  setAmount: (value: string) => {},
});

const ConvertedAmountContext = createContext({
  convertedAmount: "",
  setConvertedAmount: (value: string) => {},
});

export default function CurrencyConverter() {
  const [exchangeRatesCache, setExchangeRatesCache] = useState<Record<
    string,
    number
  > | null>(null);
  const { currencies } = useContext(AppContext);

  return (
    <AppContext.Provider
      value={{
        exchangeRatesCache,
        setExchangeRatesCache,
        currencies,
      }}
    >
      <BaseCurrencyProvider>
        <TargetCurrencyProvider>
          <AmountProvider>
            <ConvertedAmountProvider>
              <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Currency Converter</CardTitle>
                  <CardDescription>
                    Convert between different currencies.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
                    <Label htmlFor="base-currency">Base Currency</Label>
                    <SelectBaseCurrency />
                  </div>
                  <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
                    <Label htmlFor="amount">Amount</Label>
                    <AmountInput />
                  </div>
                  <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
                    <Label htmlFor="target-currency">Target Currency</Label>
                    <SelectTargetCurrency />
                  </div>
                  <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
                    <Label htmlFor="converted-amount">Converted Amount</Label>
                    <AmountOutput />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <ConvertButton />
                </CardFooter>
              </Card>
            </ConvertedAmountProvider>
          </AmountProvider>
        </TargetCurrencyProvider>
      </BaseCurrencyProvider>
    </AppContext.Provider>
  );
}

function AmountProvider({ children }: { children: any }) {
  const [amount, setAmount] = useState("");
  return (
    <AmountContext.Provider value={{ amount, setAmount }}>
      {children}
    </AmountContext.Provider>
  );
}

function TargetCurrencyProvider({ children }: { children: any }) {
  const [targetCurrency, setTargetCurrency] = useState("");
  return (
    <TargetCurrencyContext.Provider
      value={{ targetCurrency, setTargetCurrency }}
    >
      {children}
    </TargetCurrencyContext.Provider>
  );
}

function BaseCurrencyProvider({ children }: { children: any }) {
  const [baseCurrency, setBaseCurrency] = useState("");
  return (
    <BaseCurrencyContext.Provider value={{ baseCurrency, setBaseCurrency }}>
      {children}
    </BaseCurrencyContext.Provider>
  );
}

function ConvertedAmountProvider({ children }: { children: any }) {
  const [convertedAmount, setConvertedAmount] = useState("");
  return (
    <ConvertedAmountContext.Provider
      value={{ convertedAmount, setConvertedAmount }}
    >
      {children}
    </ConvertedAmountContext.Provider>
  );
}

function AmountOutput() {
  const { convertedAmount } = useContext(ConvertedAmountContext);
  return (
    <Input
      id="converted-amount"
      type="text"
      placeholder="Converted amount"
      value={convertedAmount}
      readOnly
    />
  );
}

function AmountInput() {
  const { amount, setAmount } = useContext(AmountContext);
  return (
    <Input
      id="amount"
      type="number"
      placeholder="Enter amount"
      value={amount}
      onChange={(event) => setAmount(event.target.value)}
    />
  );
}

function SelectTargetCurrency() {
  const { currencies } = useContext(AppContext);
  const { targetCurrency, setTargetCurrency } = useContext(
    TargetCurrencyContext
  );
  const { baseCurrency } = useContext(BaseCurrencyContext);

  const filteredCurrencies = currencies.filter(
    (currency) => currency !== baseCurrency
  );

  return (
    <Select
      value={targetCurrency}
      onValueChange={(currency) => setTargetCurrency(currency)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        {filteredCurrencies.map((currency) => (
          <SelectItem key={currency} value={currency}>
            {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SelectBaseCurrency() {
  const { currencies } = useContext(AppContext);
  const { baseCurrency, setBaseCurrency } = useContext(BaseCurrencyContext);
  return (
    <Select
      value={baseCurrency}
      onValueChange={(currency) => setBaseCurrency(currency)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency} value={currency}>
            {currency}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ConvertButton() {
  const { amount } = useContext(AmountContext);
  const { baseCurrency } = useContext(BaseCurrencyContext);
  const { exchangeRatesCache, setExchangeRatesCache } = useContext(AppContext);
  const { targetCurrency } = useContext(TargetCurrencyContext);
  const { setConvertedAmount } = useContext(ConvertedAmountContext);

  const handleConvert = async () => {
    if (!amount || !baseCurrency || !targetCurrency) {
      alert("Please fill in all fields.");
      return;
    }

    let exchangeRates = exchangeRatesCache;

    if (!exchangeRates) {
      try {
        const response = await fetch(
          "https://static.tripovy.com/exchange_rates.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates.");
        }

        exchangeRates = await response.json();
        setExchangeRatesCache(exchangeRates);
      } catch (error) {
        alert("Failed to connect to the server.");
        return;
      }
    }

    const baseCurrencyRate = exchangeRates[baseCurrency];
    const targetCurrencyRate = exchangeRates[targetCurrency];

    if (!baseCurrencyRate || !targetCurrencyRate) {
      alert("Failed to retrieve currency rates.");
      return;
    }

    const converted = (Number(amount) / baseCurrencyRate) * targetCurrencyRate;
    setConvertedAmount(converted.toFixed(2));
  };

  return (
    <Button
      type="submit"
      onClick={handleConvert}
      disabled={!baseCurrency || !amount || !targetCurrency}
    >
      Convert
    </Button>
  );
}
