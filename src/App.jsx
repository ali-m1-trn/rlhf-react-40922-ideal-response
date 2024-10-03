import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function App() {
  const [people, setPeople] = useState([]);

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showDebtsDialog, setShowDebtsDialog] = useState(false);

  const addPerson = (newPersonName) => {
    setPeople([...people, { name: newPersonName, items: [], payments: [] }]);
  };

  const addItem = (personIndex, itemName, itemValue) => {
    const updatedPeople = [...people];

    const newItems = [...updatedPeople[personIndex].items];

    newItems.push({ name: itemName, value: parseFloat(itemValue) });

    updatedPeople[personIndex].items = newItems;

    setPeople(updatedPeople);
  };

  const removeItem = (personIndex, index) => {
    const updatedPeople = [...people];

    const newItems = [...updatedPeople[personIndex].items];

    newItems.splice(index, 1);

    updatedPeople[personIndex].items = newItems;

    setPeople(updatedPeople);
  };

  const addPayment = (personIndex, paymentValue) => {
    const updatedPeople = [...people];

    const newPayments = [...updatedPeople[personIndex].payments];

    newPayments.push(parseFloat(paymentValue));

    updatedPeople[personIndex].payments = newPayments;

    setPeople(updatedPeople);
  };

  const removePayment = (personIndex, index) => {
    const updatedPeople = [...people];

    const newPayments = [...updatedPeople[personIndex].payments];

    newPayments.splice(index, 1);

    updatedPeople[personIndex].payments = newPayments;

    setPeople(updatedPeople);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bill Splitter</h1>
        <Dialog open={showDebtsDialog} onOpenChange={setShowDebtsDialog}>
          <DialogTrigger asChild>
            <Button>$ Debts</Button>
          </DialogTrigger>
          <DebtsDialog people={people} />
        </Dialog>
      </div>
      <AddPersonForm addPerson={addPerson} />
      {people.map((person, index) => (
        <Dialog
          key={index}
          open={selectedPerson === index}
          onOpenChange={(open) => !open && setSelectedPerson(null)}
        >
          <DialogTrigger asChild>
            <div>
              <PersonCard
                person={person}
                personIndex={index}
                setSelectedPerson={setSelectedPerson}
              />
            </div>
          </DialogTrigger>
          <PersonProfileDialog
            person={person}
            personIndex={index}
            addItem={addItem}
            removeItem={removeItem}
            addPayment={addPayment}
            removePayment={removePayment}
          />
        </Dialog>
      ))}
    </div>
  );
}

function PersonCard({ person, personIndex, setSelectedPerson }) {
  const balance = calculateBalance(person);
  const owes = calculateBalance(person) >= 0;

  return (
    <Card
      className="mb-2 md:mb-4 cursor-pointer hover:bg-gray-800"
      onClick={() => setSelectedPerson(personIndex)}
    >
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col md:flex-row justify-between">
            {person.name}
            <p
              className={`mt-4 md:mt-0 text-lg ${
                owes ? "text-green-500" : "text-red-500"
              }`}
            >
              {owes ? "Owed: " : "Owes: "}${Math.abs(balance).toFixed(2)}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

function AddPersonForm({ addPerson }) {
  const [newPersonName, setNewPersonName] = useState("");

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      addPerson(newPersonName.trim());

      setNewPersonName("");
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Person</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter name"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleAddPerson}>+ Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PersonProfileDialog({
  person,
  personIndex,
  addItem,
  removeItem,
  addPayment,
  removePayment,
}) {
  const [newItemName, setNewItemName] = useState("");
  const [newItemValue, setNewItemValue] = useState("");
  const [newPayment, setNewPayment] = useState("");

  const handleAddItem = () => {
    if (newItemName && newItemValue) {
      addItem(personIndex, newItemName, newItemValue);
      setNewItemName("");
      setNewItemValue("");
    }
  };

  const handleAddPayment = () => {
    if (newPayment) {
      addPayment(personIndex, newPayment);
      setNewPayment("");
    }
  };

  return (
    <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{person.name}'s Profile</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-8 items-center gap-4">
          <Input
            placeholder="Item name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="col-span-3"
          />
          <Input
            className="col-span-3"
            type="number"
            placeholder="Value"
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
          />
          <Button className="col-span-2" onClick={handleAddItem}>
            + Add
          </Button>
        </div>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {person.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>{item.name}</span>
              <span>${item.value.toFixed(2)}</span>
              <Button
                className="text-red-500 hover:text-red-600"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(personIndex, index)}
              >
                X
              </Button>
            </div>
          ))}
        </ScrollArea>
        <div className="grid grid-cols-4 items-center gap-4">
          <Input
            type="number"
            placeholder="Payment amount"
            value={newPayment}
            onChange={(e) => setNewPayment(e.target.value)}
            className="col-span-3"
          />
          <Button onClick={handleAddPayment}>$ Pay</Button>
        </div>
        <ScrollArea className="h-[100px] w-full rounded-md border p-4">
          {person.payments.map((payment, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>Payment: ${payment.toFixed(2)}</span>
              <span>${payment.toFixed(2)}</span>
              <Button
                className="text-red-500 hover:text-red-600"
                variant="ghost"
                size="sm"
                onClick={() => removePayment(personIndex, index)}
              >
                X
              </Button>
            </div>
          ))}
        </ScrollArea>
      </div>
    </DialogContent>
  );
}

function DebtsDialog({ people }) {
  const debts = calculateDebts(people);

  return (
    <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Remaining Debts</DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        {debts === null || debts.length === 0 ? (
          <Alert variant="destructive">
            <AlertDescription>
              {debts === null
                ? "Total payments and total item values do not match!"
                : "There are no debts to show."}
            </AlertDescription>
          </Alert>
        ) : (
          debts.map((debt, index) => (
            <div key={index} className="mb-2">
              <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] text-sm border border-slate-200 rounded-md text-red-900">
                {debt.from}
              </code>{" "}
              <span>owes</span>{" "}
              <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] text-sm border border-slate-200 rounded-md text-green-900">
                {debt.to}
              </code>{" "}
              : ${debt.amount}
            </div>
          ))
        )}
      </ScrollArea>
    </DialogContent>
  );
}

function sum(arr, getProp) {
  return arr.reduce(
    (total, item) => total + (getProp ? getProp(item) : item),
    0
  );
}

function calculateBalance(person) {
  const totalItems = sum(person.items, (i) => i.value);
  const totalPayments = sum(person.payments);

  return totalPayments - totalItems;
}

function calculateDebts(people) {
  const totalSpent = sum(people, (p) => sum(p.items, (i) => i.value));

  const totalPaid = sum(people, (p) => sum(p.payments));

  if (Math.abs(totalSpent - totalPaid) > 0.01) {
    return null; // Unbalanced sheet
  }

  const debts = [];

  for (const [i, payer] of people.entries()) {
    const payerBalance = calculateBalance(payer);

    for (const [j, receiver] of people.entries()) {
      if (i === j) continue;

      const receiverBalance = calculateBalance(receiver);

      if (payerBalance > 0 && receiverBalance < 0) {
        const amount = Math.min(payerBalance, -receiverBalance);

        if (amount > 0) {
          debts.push({
            from: receiver.name,
            to: payer.name,
            amount: amount.toFixed(2),
          });
        }
      }
    }
  }

  return debts;
}
