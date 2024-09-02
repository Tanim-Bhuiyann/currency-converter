"use client";

import { useState } from "react";
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
import { Currency } from "lucide-react";

export default function CurrencyConverter() {
  const [baseCurrency, setBaseCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");

  const [convertedAmount, setConvertedAmount] = useState("");

  const [exchangeRatesCache, setExchangeRatesCache] = useState<Record<
    string,
    number
  > | null>(null);

  const currencies = ["USD", "EUR", "GBP", "BDT"];
  const filteredCurrencies = currencies.filter(
    (currency) => currency !== baseCurrency
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert between different currencies.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
          <Label htmlFor="base-currency">Base Currency</Label>

          <Select
            value={baseCurrency}
            onValueChange={(currency) => {
              setBaseCurrency(currency);
            }}
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
        </div>
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
          <Label htmlFor="amount">Amount</Label>

          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(event) => {
              const value = event.target.value;
              setAmount(value);
            }}
          />
        </div>
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
          <Label htmlFor="target-currency">Target Currency</Label>
          <Select
            value={targetCurrency}
            onValueChange={(currency) => {
              setTargetCurrency(currency);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {filteredCurrencies.map((Currency) => (
                <SelectItem key={Currency} value={Currency}>
                  {Currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
          <Label htmlFor="converted-amount">Converted Amount</Label>
          <Input
            id="converted-amount"
            type="text"
            placeholder="Converted amount"
            value={convertedAmount}
            readOnly
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          onClick={async () => {
            //TODO: waiting for better logic
            let exchangeRates;

            if (!exchangeRatesCache) {
              try {
                const response = await fetch(
                  "https://static.tripovy.com/exchange_rates.json"
                );
                if (!response.ok) {
                  throw new Error("Failed to fetch exchange rates.");
                }

                const exchangeRates = (await response.json()) as Record<
                  string,
                  number
                >;
                setExchangeRatesCache(exchangeRates);
              } catch (error) {
                alert("Failed to connect server.");
              }
            } else {
              exchangeRates = exchangeRatesCache;
            }

            if (!exchangeRates) {
              return;
            }

            const baseCurrencyRate = exchangeRates[baseCurrency];
            const targetCurrencyRate = exchangeRates[targetCurrency];

            const target =
              (1 / baseCurrencyRate) * targetCurrencyRate * Number(amount);
            setConvertedAmount(target.toFixed(2));

            /*    const numericAmount = Number(amount);
            const convertedAmount = (numericAmount / baseCurrencyRate) * targetCurrencyRate;
            setConvertedAmount(convertedAmount.toFixed(2)); */

            console.log(baseCurrencyRate, targetCurrencyRate);
          }}
          disabled={!baseCurrency || !amount || !targetCurrency}
        >
          Convert
        </Button>
      </CardFooter>
    </Card>
  );
}
