import {Component, h, Prop, Event, EventEmitter, Method} from "@stencil/core";
import {DefaultActions, StorageDriverDescriptor, Variable} from "../../../models";
import {FormEntry} from "../../shared/forms/form-entry";
import {isNullOrWhitespace} from "../../../utils";
import descriptorsStore from '../../../data/descriptors-store';

@Component({
  tag: 'elsa-variable-editor-dialog',
  shadow: false
})
export class VariableEditorDialog {
  private modalDialog: HTMLElsaModalDialogElement;

  @Prop() variable: Variable;
  @Event() variableChanged: EventEmitter<Variable>;

  @Method()
  public async show() {
    await this.modalDialog.show();
  }

  @Method()
  public async hide() {
    await this.modalDialog.hide();
  }

  render() {
    const variable: Variable = this.variable ?? {id: '', name: '', type: 'Object'};
    const variableType = variable.type;
    const cancelAction = DefaultActions.Cancel();
    const saveAction = DefaultActions.Save();
    const actions = [cancelAction, saveAction];
    const availableTypes: Array<string> = ['Object', 'String', 'Int32', 'Int64', 'Single', 'Double']; // TODO: Fetch these from backend.
    const storageDrivers: Array<StorageDriverDescriptor> = [{ id: null, displayName: '-' }, ...descriptorsStore.storageDrivers];

    return (
      <div>
        <form class="h-full flex flex-col bg-white" onSubmit={e => this.onSubmit(e)} method="post">
          <elsa-modal-dialog ref={el => (this.modalDialog = el)} actions={actions}>
            <div class="pt-4">
              <h2 class="text-lg font-medium ml-4 mb-2">Edit Variable</h2>
              <div class="align-middle inline-block min-w-full border-b border-gray-200">

                <FormEntry fieldId="variableName" label="Name" hint="The technical name of the variable.">
                  <input type="text" name="variableName" id="variableName" value={variable.name}/>
                </FormEntry>

                <FormEntry fieldId="variableType" label="Type" hint="The type of the variable.">
                  <select id="variableType" name="variableType">
                    {availableTypes.map(type => <option value={type} selected={type == variableType}>{type}</option>)}
                  </select>
                </FormEntry>

                <FormEntry fieldId="variableValue" label="Value" hint="The value of the variable.">
                  <input type="text" name="variableValue" id="variableValue" value={variable.value}/>
                </FormEntry>

                <FormEntry fieldId="variableStorageDriverId" label="Storage" hint="The storage to use when persisting the variable.">
                  <select id="variableStorageDriverId" name="variableStorageDriverId">
                    {storageDrivers.map(driver => {
                      const value = driver.id;
                      const text = driver.displayName;
                      const selected = value == variable.storageDriverId;
                      return <option value={value} selected={selected}>{text}</option>;
                    })}
                  </select>
                </FormEntry>

              </div>
            </div>
          </elsa-modal-dialog>
        </form>
      </div>
    );
  }

  private onSubmit = async (e: Event) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('variableName') as string;
    const value = formData.get('variableValue') as string;
    const type = formData.get('variableType') as string;
    const driverId = formData.get('variableStorageDriverId') as string;
    const variable = this.variable;

    variable.id = name;
    variable.name = name;
    variable.type = type;
    variable.value = value;
    variable.storageDriverId = isNullOrWhitespace(driverId) ? null : driverId;

    this.variableChanged.emit(variable);
    await this.hide();
  };

}
