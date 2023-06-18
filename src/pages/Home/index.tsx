import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { createContext, useContext, useEffect, useState } from "react";
import { NewCycleForm } from "./components/NeyCycleForm";
import { Countdown } from "./components/Countdown";

import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { CyclesContext } from "../../contexts/CyclesContext";

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5, "O ciclo deve ser maior do que 5 minutos").max(60, "O intervalo precisa ser de no máximo 60 minutos."),
})

export function Home() {

  const {activeCycle, createNewCycle, interruptCurrentCycle} = useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0
    }
  })

  const { handleSubmit, watch, reset} = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task
  
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>

          
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>

          <Countdown />

          {activeCycle ? 
            <StopCountdownButton onClick={interruptCurrentCycle} type="button">
              <HandPalm size={24} />
              Interromper
            </StopCountdownButton>
          :
            <StartCountdownButton disabled={isSubmitDisabled} type="submit">
              <Play size={24} />
              Começar
            </StartCountdownButton>
        }

      </form>
    </HomeContainer>
  );
}
