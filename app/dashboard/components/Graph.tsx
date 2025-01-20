'use client';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../../components/ui/chart';

interface iGraphProps {
  data: { date: string; amount: number }[];
}

export default function Graph({ data }: iGraphProps) {
  return (
    <ChartContainer
      config={{
        amount: {
          label: 'Amount',
          color: 'hsl(var(--primary))',
        },
      }}
      className='min-h-[300px]'
    >
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data} barSize={20}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey='date' />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent indicator='dashed'></ChartTooltipContent>} />
          <Bar dataKey='amount' fill='var(--color-desktop)' />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
