

export default function Modal({title, message, confirm, onConfirm}) {

  return (
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body items-center text-center">
        <h2 class="card-title">{title}</h2>
        <p>{message}</p>
        <div class="card-actions">
          <button class="btn btn-primary" onClick={onConfirm}>{confirm}</button>
        </div>
      </div>
    </div>
  )
}