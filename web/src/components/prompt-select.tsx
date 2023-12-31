import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { api } from "@/lib/axios";


interface Prompt {
    id: string
    title: string
    template: string
}
interface PromptSelectedProps {
    onPromptSelected: (template: string) => void
}
export function PromptSelect(props: PromptSelectedProps) {
    const [prompts, setPrompts] = useState<Prompt[] | null>(null)

    useEffect(() =>{
        api.get('/prompts').then(response => {
            setPrompts(response.data)
        })
    }, [])

    function HandlePromptSelected(promptId: string) {
        const selectedPrompt = prompts?.find(prompt => prompt.id === promptId)
        if (!selectedPrompt) {
            return
        }

        props.onPromptSelected(selectedPrompt.template)
    
    }

  return (
    <Select onValueChange={HandlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder='Selecione um prompt...'/>
      </SelectTrigger>
      <SelectContent>
        {prompts?.map(prompt => {
            return (
                <SelectItem key={prompt.id} value={prompt.id}>
                    {prompt.title}
                </SelectItem>
            )
        })}
      </SelectContent>
    </Select>
  );
}
