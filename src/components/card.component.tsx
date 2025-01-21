import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
}

const Card = ({ children }: CardProps) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-4">
            {children}
        </div>
    )
}

export default Card;

