import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Sample() {
  return (
    <div>
        <SmallSample/>
   
      <Test2 />
    </div>
  );
}

function SmallSample() {
  const [test1, setTest1] = useState("Test-1");

  return (
    <div>
      <p>Small Test 1 :{test1}</p>

      <Test1 test1={test1} setTest1={setTest1} />
    </div>
  );
}

function Test2() {
  const [test2, setTest2] = useState("Test-2");
  return (
    <div>
      <p>{test2}</p>

      <Button onClick={() => setTest2("Changed 2")}>Change 2</Button>
    </div>
  );
}

function Test1({ test1, setTest1 }: any) {
  return (
    <div>
      <p>{test1}</p>

      <Button onClick={() => setTest1("Changed 1")}>Change 1</Button>
    </div>
  );
}
