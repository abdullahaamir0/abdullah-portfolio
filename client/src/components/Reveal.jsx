import useReveal from '../hooks/useReveal.js'

export default function Reveal({ children, className = '', as: Tag = 'div', ...rest }) {
  const [ref, isVisible] = useReveal()
  return (
    <Tag ref={ref} className={`reveal ${isVisible ? 'in' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}
