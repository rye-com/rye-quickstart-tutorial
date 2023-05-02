import type { ReactNode, ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { Children } from 'react';
import type { TerminalTabProps } from './code-terminal-tab';


type TerminalProps = {
  onTabChange?: (index: number) => void;
  children: ReactNode;
}

export default function Terminal({ onTabChange, children }: TerminalProps) {
  const arrayChildren = Children.toArray(children) as ReactElement<TerminalTabProps>[];
  const foundSelectedChildIndex = arrayChildren.findIndex(child => child.props.selected);
  const selectedChildIndex = foundSelectedChildIndex !== -1 ? foundSelectedChildIndex : 0;
  const [selectedTab, setSelectedTab] = useState(selectedChildIndex);

  useEffect(() => {
    setSelectedTab(selectedChildIndex);
  }, [selectedChildIndex]);

  const labels = arrayChildren.map((child, index) => (
    <button 
      className={`w-fit rounded-xl py-[4px] px-[10px] text-terminal-file-name ml-2 ${selectedTab === index ? 'text-black bg-white' : 'text-neutral-content-grey'}`} 
      onClick={() => {
        setSelectedTab(index)
        if(onTabChange) { onTabChange(index)}
      }}
    >
      {child.props.label}
    </button>
  ));

  return (
    <div className="mt-2 rounded-3xl bg-terminal-black px-6 py-5 overflow-auto w-full h-full">
      <div className="flex gap-2 text-white">
        {labels}
      </div>
      {arrayChildren[selectedTab]}
    </div>
  );
}
